using System.Text.Json;
using BookCircle.Api.Hubs;
using BookCircle.Api.Models;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BookCircle.Api.Services;

public sealed class NotificationService(
    IHubContext<NotificationHub> hubContext,
    INotificationRepository notificationRepository) : INotificationService
{
    public async Task NotifyBorrowRequestSentAsync(Guid ownerId, object payload)
    {
        await SaveAndSendAsync(ownerId, "borrow-request", "New Borrow Request", "Someone wants to borrow your book!", payload, "BorrowRequestSent");
    }

    public async Task NotifyBorrowDecisionAsync(Guid readerId, object payload)
    {
        await SaveAndSendAsync(readerId, "borrow-update", "Borrow Request Update", "The owner has responded to your request.", payload, "BorrowRequestUpdated");
    }

    public async Task NotifyCommentCreatedAsync(Guid recipientUserId, object payload)
    {
        await SaveAndSendAsync(recipientUserId, "comment", "New Comment", "Someone commented on your book.", payload, "CommentCreated");
    }

    public async Task<IEnumerable<Notification>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await notificationRepository.GetForUserAsync(userId, cancellationToken);
    }

    public async Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await notificationRepository.MarkAllAsReadAsync(userId, cancellationToken);
    }

    private async Task SaveAndSendAsync(Guid userId, string type, string title, string message, object payload, string hubMethod)
    {
        var jsonPayload = JsonSerializer.Serialize(payload);

        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            Payload = jsonPayload,
            IsRead = false
        };

        await notificationRepository.AddAsync(notification);
        await notificationRepository.SaveChangesAsync();

        // Push real-time
        await hubContext.Clients.User(userId.ToString()).SendAsync(hubMethod, payload);
    }
}
