namespace BookCircle.Api.DTOs.Auth;

public sealed class RegisterResponseDto
{
    public string Message { get; set; } = string.Empty;
    public bool RequiresApproval { get; set; }
    public UserSummaryDto User { get; set; } = new();
    public AuthResponseDto? Auth { get; set; }
}
