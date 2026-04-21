using BookCircle.Api.Models.Enums;

namespace BookCircle.Api.DTOs.Books;

public sealed class BookResponseDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public DateOnly PublicationDate { get; set; }
    public decimal BorrowPrice { get; set; }
    public BookAvailabilityStatus Status { get; set; }
    public DateOnly? AvailableFrom { get; set; }
    public DateOnly? AvailableTo { get; set; }
    public string? CoverImageUrl { get; set; }
    public Guid OwnerId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public BookApprovalStatus ApprovalStatus { get; set; }
    public int LikesCount { get; set; }
    public int DislikesCount { get; set; }
}
