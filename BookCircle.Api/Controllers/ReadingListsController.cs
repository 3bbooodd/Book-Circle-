using BookCircle.Api.Constants;
using BookCircle.Api.DTOs.ReadingLists;
using BookCircle.Api.Extensions;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = ApplicationRoles.Reader)]
public sealed class ReadingListsController(IReadingListService readingListService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReadingListResponseDto>>> GetMine(CancellationToken cancellationToken)
    {
        var result = await readingListService.GetUserListsAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ReadingListResponseDto>> Create(CreateReadingListRequestDto request, CancellationToken cancellationToken)
    {
        var result = await readingListService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return Ok(result);
    }

    [HttpPost("{readingListId:guid}/books")]
    public async Task<ActionResult<ReadingListResponseDto>> AddBook(Guid readingListId, AddBookToReadingListRequestDto request, CancellationToken cancellationToken)
    {
        var result = await readingListService.AddBookAsync(User.GetUserId(), readingListId, request, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{readingListId:guid}/books/{bookId:guid}")]
    public async Task<IActionResult> RemoveBook(Guid readingListId, Guid bookId, CancellationToken cancellationToken)
    {
        await readingListService.RemoveBookAsync(User.GetUserId(), readingListId, bookId, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{readingListId:guid}")]
    public async Task<IActionResult> DeleteList(Guid readingListId, CancellationToken cancellationToken)
    {
        await readingListService.DeleteListAsync(User.GetUserId(), readingListId, cancellationToken);
        return NoContent();
    }
}
