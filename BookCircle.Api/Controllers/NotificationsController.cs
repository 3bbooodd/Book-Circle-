using BookCircle.Api.Extensions;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class NotificationsController(INotificationService notificationService) : ControllerBase
{
    /// <summary>Returns all notifications for the current user, newest first.</summary>
    [HttpGet]
    public async Task<IActionResult> GetMine(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        var result = await notificationService.GetForUserAsync(userId, cancellationToken);
        return Ok(result);
    }

    /// <summary>Marks every unread notification for the current user as read.</summary>
    [HttpPut("read-all")]
    public async Task<IActionResult> MarkAllRead(CancellationToken cancellationToken)
    {
        var userId = User.GetUserId();
        await notificationService.MarkAllAsReadAsync(userId, cancellationToken);
        return NoContent();
    }
}
