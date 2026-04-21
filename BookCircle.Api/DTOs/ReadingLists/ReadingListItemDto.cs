using BookCircle.Api.Models.Enums;

namespace BookCircle.Api.DTOs.ReadingLists;

public sealed class ReadingListItemDto
{
    public Guid BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public string? CoverImageUrl { get; set; }
    public BookAvailabilityStatus Status { get; set; }
    public string OwnerName { get; set; } = string.Empty;
}
