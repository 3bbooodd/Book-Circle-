namespace BookCircle.Api.DTOs.ReadingLists;

public sealed class ReadingListResponseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public IEnumerable<ReadingListItemDto> Items { get; set; } = [];
}
