using BookCircle.Api.Constants;
using BookCircle.Api.Data;
using BookCircle.Api.DTOs.Auth;
using BookCircle.Api.DTOs.Books;
using BookCircle.Api.Exceptions;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Services;

public sealed class AdminService(
    UserManager<ApplicationUser> userManager,
    IBookRepository bookRepository) : IAdminService
{
    public async Task<IEnumerable<UserSummaryDto>> GetPendingUsersAsync(CancellationToken cancellationToken = default)
    {
        var users = await userManager.Users
            .Where(x => x.ApprovalStatus == UserApprovalStatus.Pending)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        var summaries = new List<UserSummaryDto>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            if (roles.Contains(ApplicationRoles.Admin))
            {
                continue;
            }

            summaries.Add(new UserSummaryDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                Roles = roles,
                ApprovalStatus = user.ApprovalStatus,
                IsActive = user.IsActive
            });
        }

        return summaries;
    }

    public async Task ApproveOrRejectUserAsync(Guid userId, bool approve, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User was not found.");

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains(ApplicationRoles.Admin))
        {
            throw new BadRequestException("Admin accounts cannot be moderated from this endpoint.");
        }

        user.ApprovalStatus = approve ? UserApprovalStatus.Approved : UserApprovalStatus.Rejected;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new BadRequestException(string.Join("; ", result.Errors.Select(x => x.Description)));
        }
    }

    public async Task<IEnumerable<BookResponseDto>> GetPendingBooksAsync(CancellationToken cancellationToken = default)
    {
        var books = await bookRepository.GetPendingApprovalBooksAsync(cancellationToken);
        return books.Select(MapBook);
    }

    public async Task<IEnumerable<BookResponseDto>> GetAllBooksAsync(CancellationToken cancellationToken = default)
    {
        var books = await bookRepository.GetAllBooksAsync(cancellationToken);
        return books.Select(MapBook);
    }

    public async Task ApproveOrRejectBookAsync(Guid bookId, bool approve, CancellationToken cancellationToken = default)
    {
        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        book.ApprovalStatus = approve ? BookApprovalStatus.Approved : BookApprovalStatus.Rejected;
        bookRepository.Update(book);
        await bookRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task<IEnumerable<UserSummaryDto>> GetAllUsersAsync(string? role, string? approvalStatus, bool? isActive, CancellationToken cancellationToken = default)
    {
        var query = userManager.Users.AsQueryable();

        if (!string.IsNullOrEmpty(role))
        {
            var usersInRole = await userManager.GetUsersInRoleAsync(role);
            var userIdsInRole = usersInRole.Select(u => u.Id).ToHashSet();
            query = query.Where(x => userIdsInRole.Contains(x.Id));
        }

        if (!string.IsNullOrEmpty(approvalStatus) && Enum.TryParse<UserApprovalStatus>(approvalStatus, true, out var parsedStatus))
        {
            query = query.Where(x => x.ApprovalStatus == parsedStatus);
        }

        if (isActive.HasValue)
        {
            query = query.Where(x => x.IsActive == isActive.Value);
        }

        var users = await query.OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);

        var summaries = new List<UserSummaryDto>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            if (roles.Contains(ApplicationRoles.Admin))
            {
                continue;
            }

            summaries.Add(new UserSummaryDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                UserName = user.UserName ?? string.Empty,
                Roles = roles,
                ApprovalStatus = user.ApprovalStatus,
                IsActive = user.IsActive
            });
        }

        return summaries;
    }

    public async Task<UserSummaryDto> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User was not found.");

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains(ApplicationRoles.Admin))
        {
            throw new BadRequestException("Admin accounts cannot be viewed from this endpoint.");
        }

        return new UserSummaryDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email ?? string.Empty,
            UserName = user.UserName ?? string.Empty,
            Roles = roles,
            ApprovalStatus = user.ApprovalStatus,
            IsActive = user.IsActive
        };
    }

    public async Task SetUserActiveStatusAsync(Guid userId, bool isActive, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User was not found.");

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains(ApplicationRoles.Admin))
        {
            throw new BadRequestException("Admin accounts cannot be disabled.");
        }

        user.IsActive = isActive;

        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new BadRequestException(string.Join("; ", result.Errors.Select(x => x.Description)));
        }
    }

    public async Task ChangeUserRoleAsync(Guid userId, string newRole, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User was not found.");

        var roles = await userManager.GetRolesAsync(user);
        if (roles.Contains(ApplicationRoles.Admin))
        {
            throw new BadRequestException("Admin accounts cannot have their roles changed.");
        }

        if (!ApplicationRoles.RegistrableRoles.Contains(newRole))
        {
            throw new BadRequestException($"Role '{newRole}' is not a valid registrable role.");
        }

        var removeResult = await userManager.RemoveFromRolesAsync(user, roles);
        if (!removeResult.Succeeded)
        {
            throw new BadRequestException(string.Join("; ", removeResult.Errors.Select(x => x.Description)));
        }

        var addResult = await userManager.AddToRoleAsync(user, newRole);
        if (!addResult.Succeeded)
        {
            throw new BadRequestException(string.Join("; ", addResult.Errors.Select(x => x.Description)));
        }
    }

    private static BookResponseDto MapBook(Book book)
    {
        return new BookResponseDto
        {
            Id = book.Id,
            Title = book.Title,
            Genre = book.Genre,
            ISBN = book.ISBN,
            Language = book.Language,
            PublicationDate = book.PublicationDate,
            BorrowPrice = book.BorrowPrice,
            Status = book.Status,
            AvailableFrom = book.AvailableFrom,
            AvailableTo = book.AvailableTo,
            CoverImageUrl = book.CoverImageUrl,
            OwnerId = book.OwnerId,
            OwnerName = book.Owner.FullName,
            ApprovalStatus = book.ApprovalStatus,
            LikesCount = book.Reactions.Count(x => x.IsLike),
            DislikesCount = book.Reactions.Count(x => !x.IsLike),
            UserReaction = null
        };
    }
}
