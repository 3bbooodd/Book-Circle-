using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Books;

public sealed class BookCreateRequestDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Genre { get; set; } = string.Empty;

    [Required]
    [MaxLength(30)]
    public string ISBN { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string Language { get; set; } = string.Empty;

    [Required]
    public DateOnly PublicationDate { get; set; }

    [Range(0, 100000)]
    public decimal BorrowPrice { get; set; }

    public DateOnly? AvailableFrom { get; set; }
    public DateOnly? AvailableTo { get; set; }

    [Url]
    [MaxLength(500)]
    public string? CoverImageUrl { get; set; }
}
