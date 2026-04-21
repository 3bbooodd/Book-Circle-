using BookCircle.Api.Data;
using BookCircle.Api.DTOs.Auth;

namespace BookCircle.Api.Services.Interfaces;

public interface ITokenService
{
    Task<AuthResponseDto> BuildAuthResponseAsync(ApplicationUser user, CancellationToken cancellationToken = default);
    string GenerateRefreshToken();
    string HashToken(string input);
}
