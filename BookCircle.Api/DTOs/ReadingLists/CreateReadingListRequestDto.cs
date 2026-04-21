using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.ReadingLists;

public sealed class CreateReadingListRequestDto
{
    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;
}
