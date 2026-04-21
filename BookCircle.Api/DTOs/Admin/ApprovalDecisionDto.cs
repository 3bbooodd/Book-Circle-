using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Admin;

public sealed class ApprovalDecisionDto
{
    [Required]
    public bool Approve { get; set; }
}
