using BookCircle.Api.Constants;
using BookCircle.Api.DTOs.BorrowRequests;
using BookCircle.Api.Extensions;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class BorrowController(IBorrowRequestService borrowRequestService) : ControllerBase
{
    [HttpPost("books/{bookId:guid}/requests")]
    [Authorize(Roles = ApplicationRoles.Reader)]
    public async Task<ActionResult<BorrowRequestResponseDto>> Create(Guid bookId, CreateBorrowRequestDto request, CancellationToken cancellationToken)
    {
        var result = await borrowRequestService.CreateAsync(User.GetUserId(), bookId, request, cancellationToken);
        return Ok(result);
    }

    [HttpGet("my-requests")]
    [Authorize(Roles = ApplicationRoles.Reader)]
    public async Task<ActionResult<IEnumerable<BorrowRequestResponseDto>>> GetReaderRequests(CancellationToken cancellationToken)
    {
        var result = await borrowRequestService.GetForReaderAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpGet("owner-requests")]
    [Authorize(Roles = ApplicationRoles.BookOwner)]
    public async Task<ActionResult<IEnumerable<BorrowRequestResponseDto>>> GetOwnerRequests(CancellationToken cancellationToken)
    {
        var result = await borrowRequestService.GetForOwnerAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPut("requests/{borrowRequestId:guid}/decision")]
    [Authorize(Roles = ApplicationRoles.BookOwner)]
    public async Task<ActionResult<BorrowRequestResponseDto>> Process(Guid borrowRequestId, ProcessBorrowRequestDto request, CancellationToken cancellationToken)
    {
        var result = await borrowRequestService.ProcessAsync(User.GetUserId(), borrowRequestId, request, cancellationToken);
        return Ok(result);
    }
}
