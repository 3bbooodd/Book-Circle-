using BookCircle.Api.Data;
using BookCircle.Api.Models.Enums;

namespace BookCircle.Api.Models;

public sealed class BorrowRequest : BaseEntity
{
    public Guid BookId { get; set; }
    public Guid ReaderId { get; set; }
    public DateOnly RequestedFrom { get; set; }
    public DateOnly RequestedTo { get; set; }
    public string? Message { get; set; }
    public BorrowRequestStatus Status { get; set; } = BorrowRequestStatus.Pending;
    public DateTime? ProcessedAtUtc { get; set; }

    public Book Book { get; set; } = null!;
    public ApplicationUser Reader { get; set; } = null!;
}
