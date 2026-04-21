using BookCircle.Api.DTOs.Comments;

namespace BookCircle.Api.Services.Interfaces;

public interface ICommentService
{
    Task<IEnumerable<CommentResponseDto>> GetForBookAsync(Guid bookId, CancellationToken cancellationToken = default);
    Task<CommentResponseDto> CreateAsync(Guid userId, Guid bookId, CreateCommentRequestDto request, CancellationToken cancellationToken = default);
}
