using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Comments;

public sealed class CreateCommentRequestDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    public Guid? ParentCommentId { get; set; }
}
