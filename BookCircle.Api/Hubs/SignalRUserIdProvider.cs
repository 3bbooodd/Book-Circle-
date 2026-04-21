using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;

namespace BookCircle.Api.Hubs;

public sealed class SignalRUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}
