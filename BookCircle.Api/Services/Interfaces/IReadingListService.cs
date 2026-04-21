using BookCircle.Api.DTOs.ReadingLists;

namespace BookCircle.Api.Services.Interfaces;

public interface IReadingListService
{
    Task<IEnumerable<ReadingListResponseDto>> GetUserListsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<ReadingListResponseDto> CreateAsync(Guid userId, CreateReadingListRequestDto request, CancellationToken cancellationToken = default);
    Task<ReadingListResponseDto> AddBookAsync(Guid userId, Guid readingListId, AddBookToReadingListRequestDto request, CancellationToken cancellationToken = default);
    Task RemoveBookAsync(Guid userId, Guid readingListId, Guid bookId, CancellationToken cancellationToken = default);
}
