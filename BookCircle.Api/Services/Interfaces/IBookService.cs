using BookCircle.Api.DTOs.Books;

namespace BookCircle.Api.Services.Interfaces;

public interface IBookService
{
    Task<IEnumerable<BookResponseDto>> BrowseAsync(string? search, string? genre, string? language, CancellationToken cancellationToken = default);
    Task<BookResponseDto> GetByIdAsync(Guid bookId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BookResponseDto>> GetOwnerBooksAsync(Guid ownerId, CancellationToken cancellationToken = default);
    Task<BookResponseDto> CreateAsync(Guid ownerId, BookCreateRequestDto request, CancellationToken cancellationToken = default);
    Task<BookResponseDto> UpdateAsync(Guid ownerId, Guid bookId, BookUpdateRequestDto request, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid ownerId, Guid bookId, CancellationToken cancellationToken = default);
    Task<BookResponseDto> ReactAsync(Guid userId, Guid bookId, BookReactionRequestDto request, CancellationToken cancellationToken = default);
}
