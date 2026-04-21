using BookCircle.Api.Constants;
using BookCircle.Api.Data;
using BookCircle.Api.DTOs.Auth;
using BookCircle.Api.Exceptions;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Services;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IRefreshTokenRepository refreshTokenRepository) : IAuthService
{
    public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var normalizedRole = ApplicationRoles.RegistrableRoles
            .FirstOrDefault(x => x.Equals(request.Role.Trim(), StringComparison.OrdinalIgnoreCase));

        if (normalizedRole is null)
        {
            throw new BadRequestException("Only Reader and BookOwner roles are allowed for self-registration.");
        }

        var emailExists = await userManager.Users.AnyAsync(x => x.Email == request.Email, cancellationToken);
        if (emailExists)
        {
            throw new BadRequestException("Email is already registered.");
        }

        var userNameExists = await userManager.Users.AnyAsync(x => x.UserName == request.UserName, cancellationToken);
        if (userNameExists)
        {
            throw new BadRequestException("Username is already taken.");
        }

        var user = new ApplicationUser
        {
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            UserName = request.UserName.Trim(),
            ApprovalStatus = normalizedRole == ApplicationRoles.Reader ? UserApprovalStatus.Approved : UserApprovalStatus.Pending,
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            throw new BadRequestException(string.Join("; ", result.Errors.Select(x => x.Description)));
        }

        await userManager.AddToRoleAsync(user, normalizedRole);

        var roles = await userManager.GetRolesAsync(user);
        var userSummary = new UserSummaryDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            Roles = roles,
            ApprovalStatus = user.ApprovalStatus
        };

        if (normalizedRole == ApplicationRoles.Reader)
        {
            var auth = await tokenService.BuildAuthResponseAsync(user, cancellationToken);
            return new RegisterResponseDto
            {
                Message = "Reader account created successfully.",
                RequiresApproval = false,
                User = userSummary,
                Auth = auth
            };
        }

        return new RegisterResponseDto
        {
            Message = "BookOwner account created and is pending admin approval.",
            RequiresApproval = true,
            User = userSummary
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var normalizedInput = request.EmailOrUserName.Trim();
        var user = await userManager.Users.FirstOrDefaultAsync(
            x => x.Email == normalizedInput || x.UserName == normalizedInput,
            cancellationToken);

        if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new UnauthorizedException("Invalid credentials.");
        }

        EnsureUserCanAuthenticate(user);

        return await tokenService.BuildAuthResponseAsync(user, cancellationToken);
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var tokenHash = tokenService.HashToken(request.RefreshToken);
        var refreshToken = await refreshTokenRepository.GetByTokenHashAsync(tokenHash, cancellationToken)
            ?? throw new UnauthorizedException("Invalid refresh token.");

        if (!refreshToken.IsActive)
        {
            throw new UnauthorizedException("Refresh token has expired or been revoked.");
        }

        EnsureUserCanAuthenticate(refreshToken.User);

        refreshToken.RevokedAtUtc = DateTime.UtcNow;
        refreshToken.RevokedByIp = ipAddress;
        refreshTokenRepository.Update(refreshToken);
        await refreshTokenRepository.SaveChangesAsync(cancellationToken);

        return await tokenService.BuildAuthResponseAsync(refreshToken.User, cancellationToken);
    }

    public async Task LogoutAsync(Guid userId, string refreshToken, string? ipAddress, CancellationToken cancellationToken = default)
    {
        var tokenHash = tokenService.HashToken(refreshToken);
        var storedToken = await refreshTokenRepository.GetByTokenHashAsync(tokenHash, cancellationToken)
            ?? throw new NotFoundException("Refresh token was not found.");

        if (storedToken.UserId != userId)
        {
            throw new ForbiddenException("You cannot revoke another user's refresh token.");
        }

        storedToken.RevokedAtUtc = DateTime.UtcNow;
        storedToken.RevokedByIp = ipAddress;
        refreshTokenRepository.Update(storedToken);
        await refreshTokenRepository.SaveChangesAsync(cancellationToken);
    }

    private static void EnsureUserCanAuthenticate(ApplicationUser user)
    {
        if (!user.IsActive)
        {
            throw new ForbiddenException("User account is disabled.");
        }

        if (user.ApprovalStatus == UserApprovalStatus.Pending)
        {
            throw new ForbiddenException("Your account is pending admin approval.");
        }

        if (user.ApprovalStatus == UserApprovalStatus.Rejected)
        {
            throw new ForbiddenException("Your account has been rejected by the admin.");
        }
    }
}
