namespace BookCircle.Api.Constants;

public static class ApplicationRoles
{
    public const string Admin = "Admin";
    public const string BookOwner = "BookOwner";
    public const string Reader = "Reader";

    public static readonly string[] All = [Admin, BookOwner, Reader];
    public static readonly string[] RegistrableRoles = [BookOwner, Reader];
}
