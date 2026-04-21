using BookCircle.Api.Models;

namespace BookCircle.Api.Repositories.Interfaces;

public interface IBookRepository : IGenericRepository<Book>
{
    Task<Book?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Book>> GetBrowseableBooksAsync(string? search, string? genre, string? language, CancellationToken cancellationToken = default);
    Task<List<Book>> GetOwnerBooksAsync(Guid ownerId, CancellationToken cancellationToken = default);
    Task<List<Book>> GetPendingApprovalBooksAsync(CancellationToken cancellationToken = default);
}
