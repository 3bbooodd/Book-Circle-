using BookCircle.Api.Constants;
using BookCircle.Api.DTOs.Comments;
using BookCircle.Api.Extensions;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Api.Controllers;

[ApiController]
[Route("api/books/{bookId:guid}/comments")]
public sealed class CommentsController(ICommentService commentService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetForBook(Guid bookId, CancellationToken cancellationToken)
    {
        var result = await commentService.GetForBookAsync(bookId, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = $"{ApplicationRoles.Admin},{ApplicationRoles.BookOwner},{ApplicationRoles.Reader}")]
    public async Task<ActionResult<CommentResponseDto>> Create(Guid bookId, CreateCommentRequestDto request, CancellationToken cancellationToken)
    {
        var result = await commentService.CreateAsync(User.GetUserId(), bookId, request, cancellationToken);
        return Ok(result);
    }
}
