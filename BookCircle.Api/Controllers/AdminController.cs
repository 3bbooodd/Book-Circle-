using BookCircle.Api.Constants;
using BookCircle.Api.DTOs.Admin;
using BookCircle.Api.DTOs.Auth;
using BookCircle.Api.DTOs.Books;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = ApplicationRoles.Admin)]
public sealed class AdminController(IAdminService adminService) : ControllerBase
{
    [HttpGet("pending-users")]
    public async Task<ActionResult<IEnumerable<UserSummaryDto>>> GetPendingUsers(CancellationToken cancellationToken)
    {
        var result = await adminService.GetPendingUsersAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPut("users/{userId:guid}/approval")]
    public async Task<IActionResult> ModerateUser(Guid userId, ApprovalDecisionDto request, CancellationToken cancellationToken)
    {
        await adminService.ApproveOrRejectUserAsync(userId, request.Approve, cancellationToken);
        return NoContent();
    }

    [HttpGet("pending-books")]
    public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetPendingBooks(CancellationToken cancellationToken)
    {
        var result = await adminService.GetPendingBooksAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPut("books/{bookId:guid}/approval")]
    public async Task<IActionResult> ModerateBook(Guid bookId, ApprovalDecisionDto request, CancellationToken cancellationToken)
    {
        await adminService.ApproveOrRejectBookAsync(bookId, request.Approve, cancellationToken);
        return NoContent();
    }
}
