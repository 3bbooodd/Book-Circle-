namespace BookCircle.Api.DTOs.Comments;

public sealed class CommentResponseDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public Guid? ParentCommentId { get; set; }
    public IEnumerable<CommentReplyDto> Replies { get; set; } = [];
}
