using BookCircle.Api.Data;

namespace BookCircle.Api.Models;

public sealed class Comment : BaseEntity
{
    public Guid BookId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ParentCommentId { get; set; }

    public Book Book { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
    public Comment? ParentComment { get; set; }
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}
