using System.Security.Claims;
using BookCircle.Api.Exceptions;

namespace BookCircle.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var value = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub");

        if (!Guid.TryParse(value, out var userId))
        {
            throw new UnauthorizedException("Invalid authenticated user context.");
        }

        return userId;
    }
}
