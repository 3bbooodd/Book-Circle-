using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Auth;

public sealed class RefreshTokenRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
