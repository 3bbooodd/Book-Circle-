using BookCircle.Api.Data;
using BookCircle.Api.Models.Enums;

namespace BookCircle.Api.Models;

public sealed class Book : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public DateOnly PublicationDate { get; set; }
    public decimal BorrowPrice { get; set; }
    public BookAvailabilityStatus Status { get; set; } = BookAvailabilityStatus.Available;
    public DateOnly? AvailableFrom { get; set; }
    public DateOnly? AvailableTo { get; set; }
    public string? CoverImageUrl { get; set; }
    public Guid OwnerId { get; set; }
    public BookApprovalStatus ApprovalStatus { get; set; } = BookApprovalStatus.Pending;

    public ApplicationUser Owner { get; set; } = null!;
    public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<BookReaction> Reactions { get; set; } = new List<BookReaction>();
    public ICollection<ReadingListItem> ReadingListItems { get; set; } = new List<ReadingListItem>();
}
