using BookCircle.Api.Data;

namespace BookCircle.Api.Models;

public sealed class BookReaction : BaseEntity
{
    public Guid BookId { get; set; }
    public Guid UserId { get; set; }
    public bool IsLike { get; set; }

    public Book Book { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;
}
