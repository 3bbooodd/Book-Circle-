using BookCircle.Api.Data;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Repositories;

public sealed class BorrowRequestRepository(ApplicationDbContext context) : GenericRepository<BorrowRequest>(context), IBorrowRequestRepository
{
    public async Task<BorrowRequest?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.BorrowRequests
            .Include(x => x.Book)
                .ThenInclude(x => x.Owner)
            .Include(x => x.Reader)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<BorrowRequest>> GetForOwnerAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        return await Context.BorrowRequests
            .Include(x => x.Book)
            .Include(x => x.Reader)
            .Where(x => x.Book.OwnerId == ownerId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<BorrowRequest>> GetForReaderAsync(Guid readerId, CancellationToken cancellationToken = default)
    {
        return await Context.BorrowRequests
            .Include(x => x.Book)
            .Include(x => x.Reader)
            .Where(x => x.ReaderId == readerId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsActiveRequestAsync(Guid bookId, Guid readerId, CancellationToken cancellationToken = default)
    {
        return await Context.BorrowRequests.AnyAsync(
            x => x.BookId == bookId
                 && x.ReaderId == readerId
                 && (x.Status == BorrowRequestStatus.Pending || x.Status == BorrowRequestStatus.Accepted),
            cancellationToken);
    }

    public async Task<List<BorrowRequest>> GetPendingForBookAsync(Guid bookId, CancellationToken cancellationToken = default)
    {
        return await Context.BorrowRequests
            .Where(x => x.BookId == bookId && x.Status == BorrowRequestStatus.Pending)
            .ToListAsync(cancellationToken);
    }
}
