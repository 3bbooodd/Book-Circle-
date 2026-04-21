namespace BookCircle.Api.Options;

public sealed class AdminSeedOptions
{
    public const string SectionName = "AdminSeed";

    public string Email { get; set; } = "admin@bookcircle.com";
    public string Password { get; set; } = "Admin@12345";
    public string FullName { get; set; } = "BookCircle Admin";
    public string UserName { get; set; } = "bookcircle.admin";
}
