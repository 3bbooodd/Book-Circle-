using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.ReadingLists;

public sealed class AddBookToReadingListRequestDto
{
    [Required]
    public Guid BookId { get; set; }
}
