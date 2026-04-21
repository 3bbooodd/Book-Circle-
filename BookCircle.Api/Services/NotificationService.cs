using BookCircle.Api.Hubs;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BookCircle.Api.Services;

public sealed class NotificationService(IHubContext<NotificationHub> hubContext) : INotificationService
{
    public Task NotifyBorrowRequestSentAsync(Guid ownerId, object payload)
    {
        return hubContext.Clients.User(ownerId.ToString()).SendAsync("BorrowRequestSent", payload);
    }

    public Task NotifyBorrowDecisionAsync(Guid readerId, object payload)
    {
        return hubContext.Clients.User(readerId.ToString()).SendAsync("BorrowRequestUpdated", payload);
    }

    public Task NotifyCommentCreatedAsync(Guid recipientUserId, object payload)
    {
        return hubContext.Clients.User(recipientUserId.ToString()).SendAsync("CommentCreated", payload);
    }
}
