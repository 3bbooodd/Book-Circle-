using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Books;

public sealed class BookReactionRequestDto
{
    [Required]
    public bool IsLike { get; set; }
}
