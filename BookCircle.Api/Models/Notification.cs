using BookCircle.Api.Data;

namespace BookCircle.Api.Models;

public sealed class Notification : BaseEntity
{
    public Guid UserId { get; set; }

    /// <summary>E.g. "BorrowRequestCreated", "BorrowRequestUpdated", "CommentCreated", "CommentReplyCreated"</summary>
    public string Type { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;

    /// <summary>JSON-serialised payload for client-side routing / deep-link.</summary>
    public string Payload { get; set; } = "{}";

    // Navigation
    public ApplicationUser User { get; set; } = null!;
}
