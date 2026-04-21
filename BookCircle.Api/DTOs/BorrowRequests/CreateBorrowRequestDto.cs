using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.BorrowRequests;

public sealed class CreateBorrowRequestDto
{
    [Required]
    public DateOnly RequestedFrom { get; set; }

    [Required]
    public DateOnly RequestedTo { get; set; }

    [MaxLength(500)]
    public string? Message { get; set; }
}
