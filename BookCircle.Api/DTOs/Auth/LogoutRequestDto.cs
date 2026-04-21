using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Auth;

public sealed class LogoutRequestDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
