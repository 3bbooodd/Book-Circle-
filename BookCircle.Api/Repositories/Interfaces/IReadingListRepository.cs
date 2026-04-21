using BookCircle.Api.Models;

namespace BookCircle.Api.Repositories.Interfaces;

public interface IReadingListRepository : IGenericRepository<ReadingList>
{
    Task<List<ReadingList>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ReadingList?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
