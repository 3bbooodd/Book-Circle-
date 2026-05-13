using BookCircle.Api.Data;
using BookCircle.Api.Models;
using BookCircle.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Repositories;

public sealed class NotificationRepository(ApplicationDbContext context)
    : GenericRepository<Notification>(context), INotificationRepository
{
    public async Task<IEnumerable<Notification>> GetForUserAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await DbSet
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task MarkAllAsReadAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await DbSet
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(
                setters => setters.SetProperty(n => n.IsRead, true),
                cancellationToken);
    }
}
