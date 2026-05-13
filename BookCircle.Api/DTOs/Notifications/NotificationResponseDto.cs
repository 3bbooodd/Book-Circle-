namespace BookCircle.Api.DTOs.Notifications;

public sealed class NotificationResponseDto
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public bool IsRead { get; init; }
    public string Payload { get; init; } = "{}";
    public DateTime CreatedAtUtc { get; init; }
}
