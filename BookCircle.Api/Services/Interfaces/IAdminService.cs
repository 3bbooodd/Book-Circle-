using BookCircle.Api.DTOs.Auth;
using BookCircle.Api.DTOs.Books;

namespace BookCircle.Api.Services.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<UserSummaryDto>> GetPendingUsersAsync(CancellationToken cancellationToken = default);
    Task ApproveOrRejectUserAsync(Guid userId, bool approve, CancellationToken cancellationToken = default);
    Task<IEnumerable<BookResponseDto>> GetPendingBooksAsync(CancellationToken cancellationToken = default);
    Task ApproveOrRejectBookAsync(Guid bookId, bool approve, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserSummaryDto>> GetAllUsersAsync(string? role, string? approvalStatus, bool? isActive, CancellationToken cancellationToken = default);
    Task<UserSummaryDto> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task SetUserActiveStatusAsync(Guid userId, bool isActive, CancellationToken cancellationToken = default);
    Task ChangeUserRoleAsync(Guid userId, string newRole, CancellationToken cancellationToken = default);
}
