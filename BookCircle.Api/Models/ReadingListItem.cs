namespace BookCircle.Api.Models;

public sealed class ReadingListItem : BaseEntity
{
    public Guid ReadingListId { get; set; }
    public Guid BookId { get; set; }

    public ReadingList ReadingList { get; set; } = null!;
    public Book Book { get; set; } = null!;
}
