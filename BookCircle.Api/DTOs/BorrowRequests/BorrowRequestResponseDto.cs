using BookCircle.Api.Models.Enums;

namespace BookCircle.Api.DTOs.BorrowRequests;

public sealed class BorrowRequestResponseDto
{
    public Guid Id { get; set; }
    public Guid BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public Guid ReaderId { get; set; }
    public string ReaderName { get; set; } = string.Empty;
    public DateOnly RequestedFrom { get; set; }
    public DateOnly RequestedTo { get; set; }
    public string? Message { get; set; }
    public BorrowRequestStatus Status { get; set; }
    public DateTime CreatedAtUtc { get; set; }
}
