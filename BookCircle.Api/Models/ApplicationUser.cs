using BookCircle.Api.Models.Enums;
using Microsoft.AspNetCore.Identity;
using BookCircle.Api.Models;

namespace BookCircle.Api.Data;

public sealed class ApplicationUser : IdentityUser<Guid>
{
    public string FullName { get; set; } = string.Empty;
    public UserApprovalStatus ApprovalStatus { get; set; } = UserApprovalStatus.Pending;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<Book> OwnedBooks { get; set; } = new List<Book>();
    public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<BookReaction> BookReactions { get; set; } = new List<BookReaction>();
    public ICollection<ReadingList> ReadingLists { get; set; } = new List<ReadingList>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
