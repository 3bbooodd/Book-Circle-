using BookCircle.Api.Models;

namespace BookCircle.Api.Repositories.Interfaces;

public interface ICommentRepository : IGenericRepository<Comment>
{
    Task<List<Comment>> GetBookCommentsAsync(Guid bookId, CancellationToken cancellationToken = default);
    Task<Comment?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
