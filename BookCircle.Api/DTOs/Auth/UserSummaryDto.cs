using BookCircle.Api.Models.Enums;

namespace BookCircle.Api.DTOs.Auth;

public sealed class UserSummaryDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public IEnumerable<string> Roles { get; set; } = [];
    public UserApprovalStatus ApprovalStatus { get; set; }
    public bool IsActive { get; set; }
}
