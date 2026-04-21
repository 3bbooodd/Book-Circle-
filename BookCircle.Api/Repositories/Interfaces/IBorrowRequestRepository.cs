using BookCircle.Api.Models;

namespace BookCircle.Api.Repositories.Interfaces;

public interface IBorrowRequestRepository : IGenericRepository<BorrowRequest>
{
    Task<BorrowRequest?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<BorrowRequest>> GetForOwnerAsync(Guid ownerId, CancellationToken cancellationToken = default);
    Task<List<BorrowRequest>> GetForReaderAsync(Guid readerId, CancellationToken cancellationToken = default);
    Task<bool> ExistsActiveRequestAsync(Guid bookId, Guid readerId, CancellationToken cancellationToken = default);
    Task<List<BorrowRequest>> GetPendingForBookAsync(Guid bookId, CancellationToken cancellationToken = default);
}
