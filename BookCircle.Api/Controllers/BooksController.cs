using BookCircle.Api.Constants;
using BookCircle.Api.DTOs.Books;
using BookCircle.Api.Extensions;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookCircle.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class BooksController(IBookService bookService) : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<BookResponseDto>>> Browse(
        [FromQuery] string? search,
        [FromQuery] string? genre,
        [FromQuery] string? language,
        CancellationToken cancellationToken)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : null;
        var result = await bookService.BrowseAsync(userId, search, genre, language, cancellationToken);
        return Ok(result);
    }

    [HttpGet("{bookId:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookResponseDto>> GetById(Guid bookId, CancellationToken cancellationToken)
    {
        Guid? userId = User.Identity?.IsAuthenticated == true ? User.GetUserId() : null;
        var result = await bookService.GetByIdAsync(userId, bookId, cancellationToken);
        return Ok(result);
    }

    [HttpGet("mine")]
    [Authorize(Roles = ApplicationRoles.BookOwner)]
    public async Task<ActionResult<IEnumerable<BookResponseDto>>> GetMine(CancellationToken cancellationToken)
    {
        var result = await bookService.GetOwnerBooksAsync(User.GetUserId(), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = ApplicationRoles.BookOwner)]
    public async Task<ActionResult<BookResponseDto>> Create(BookCreateRequestDto request, CancellationToken cancellationToken)
    {
        var result = await bookService.CreateAsync(User.GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { bookId = result.Id }, result);
    }

    [HttpPut("{bookId:guid}")]
    [Authorize(Roles = ApplicationRoles.BookOwner)]
    public async Task<ActionResult<BookResponseDto>> Update(Guid bookId, BookUpdateRequestDto request, CancellationToken cancellationToken)
    {
        var result = await bookService.UpdateAsync(User.GetUserId(), bookId, request, cancellationToken);
        return Ok(result);
    }

    [HttpDelete("{bookId:guid}")]
    [Authorize(Roles = ApplicationRoles.BookOwner)]
    public async Task<IActionResult> Delete(Guid bookId, CancellationToken cancellationToken)
    {
        await bookService.DeleteAsync(User.GetUserId(), bookId, cancellationToken);
        return NoContent();
    }

    [HttpPost("{bookId:guid}/reaction")]
    [Authorize(Roles = $"{ApplicationRoles.Reader},{ApplicationRoles.BookOwner}")]
    public async Task<ActionResult<BookResponseDto>> React(Guid bookId, BookReactionRequestDto request, CancellationToken cancellationToken)
    {
        var result = await bookService.ReactAsync(User.GetUserId(), bookId, request, cancellationToken);
        return Ok(result);
    }
}
