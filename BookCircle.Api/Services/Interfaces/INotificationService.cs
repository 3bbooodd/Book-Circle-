using BookCircle.Api.Models;

namespace BookCircle.Api.Services.Interfaces;

public interface INotificationService
{
    Task NotifyBorrowRequestSentAsync(Guid ownerId, object payload);
    Task NotifyBorrowDecisionAsync(Guid readerId, object payload);
    Task NotifyCommentCreatedAsync(Guid recipientUserId, object payload);

    Task<IEnumerable<Notification>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default);
    Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default);
}
