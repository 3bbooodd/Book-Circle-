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

    [HttpGet("books")]
    public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetAllBooks(CancellationToken cancellationToken)
    {
        var result = await adminService.GetAllBooksAsync(cancellationToken);
        return Ok(result);
    }

    [HttpPut("books/{bookId:guid}/approval")]
    public async Task<IActionResult> ModerateBook(Guid bookId, ApprovalDecisionDto request, CancellationToken cancellationToken)
    {
        await adminService.ApproveOrRejectBookAsync(bookId, request.Approve, cancellationToken);
        return NoContent();
    }

    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserSummaryDto>>> GetAllUsers(
        [FromQuery] string? role,
        [FromQuery] string? approvalStatus,
        [FromQuery] bool? isActive,
        CancellationToken cancellationToken)
    {
        var result = await adminService.GetAllUsersAsync(role, approvalStatus, isActive, cancellationToken);
        return Ok(result);
    }

    [HttpGet("users/{userId:guid}")]
    public async Task<ActionResult<UserSummaryDto>> GetUserById(Guid userId, CancellationToken cancellationToken)
    {
        var result = await adminService.GetUserByIdAsync(userId, cancellationToken);
        return Ok(result);
    }

    [HttpPut("users/{userId:guid}/active-status")]
    public async Task<IActionResult> SetUserActiveStatus(Guid userId, SetActiveStatusDto request, CancellationToken cancellationToken)
    {
        await adminService.SetUserActiveStatusAsync(userId, request.IsActive, cancellationToken);
        return NoContent();
    }

    [HttpPut("users/{userId:guid}/role")]
    public async Task<IActionResult> ChangeUserRole(Guid userId, ChangeUserRoleDto request, CancellationToken cancellationToken)
    {
        await adminService.ChangeUserRoleAsync(userId, request.NewRole, cancellationToken);
        return NoContent();
    }
}
