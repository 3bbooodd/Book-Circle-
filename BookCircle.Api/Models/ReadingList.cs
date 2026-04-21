using BookCircle.Api.Data;

namespace BookCircle.Api.Models;

public sealed class ReadingList : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid UserId { get; set; }

    public ApplicationUser User { get; set; } = null!;
    public ICollection<ReadingListItem> Items { get; set; } = new List<ReadingListItem>();
}
