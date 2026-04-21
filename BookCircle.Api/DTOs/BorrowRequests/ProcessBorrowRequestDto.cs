using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.BorrowRequests;

public sealed class ProcessBorrowRequestDto
{
    [Required]
    public bool Approve { get; set; }
}
