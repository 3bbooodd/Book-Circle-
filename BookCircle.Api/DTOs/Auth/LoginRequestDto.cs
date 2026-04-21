using System.ComponentModel.DataAnnotations;

namespace BookCircle.Api.DTOs.Auth;

public sealed class LoginRequestDto
{
    [Required]
    public string EmailOrUserName { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
