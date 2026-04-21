using BookCircle.Api.Data;
using BookCircle.Api.DTOs.Comments;
using BookCircle.Api.Exceptions;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace BookCircle.Api.Services;

public sealed class CommentService(
    IBookRepository bookRepository,
    ICommentRepository commentRepository,
    UserManager<ApplicationUser> userManager,
    INotificationService notificationService) : ICommentService
{
    public async Task<IEnumerable<CommentResponseDto>> GetForBookAsync(Guid bookId, CancellationToken cancellationToken = default)
    {
        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.ApprovalStatus != BookApprovalStatus.Approved)
        {
            throw new ForbiddenException("Comments are available only for approved books.");
        }

        var comments = await commentRepository.GetBookCommentsAsync(bookId, cancellationToken);
        return comments.Select(MapComment);
    }

    public async Task<CommentResponseDto> CreateAsync(Guid userId, Guid bookId, CreateCommentRequestDto request, CancellationToken cancellationToken = default)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User was not found.");

        if (user.ApprovalStatus != UserApprovalStatus.Approved)
        {
            throw new ForbiddenException("Your account must be approved before commenting.");
        }

        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.ApprovalStatus != BookApprovalStatus.Approved)
        {
            throw new BadRequestException("Only approved books can receive comments.");
        }

        if (request.ParentCommentId.HasValue)
        {
            var parentComment = await commentRepository.GetDetailedByIdAsync(request.ParentCommentId.Value, cancellationToken)
                ?? throw new NotFoundException("Parent comment was not found.");

            if (parentComment.BookId != bookId)
            {
                throw new BadRequestException("Parent comment does not belong to this book.");
            }

            if (parentComment.ParentCommentId.HasValue)
            {
                throw new BadRequestException("Only one level of replies is allowed.");
            }
        }

        var comment = new Comment
        {
            BookId = bookId,
            UserId = userId,
            Content = request.Content.Trim(),
            ParentCommentId = request.ParentCommentId
        };

        await commentRepository.AddAsync(comment, cancellationToken);
        await commentRepository.SaveChangesAsync(cancellationToken);

        var savedComment = await commentRepository.GetDetailedByIdAsync(comment.Id, cancellationToken)
            ?? throw new NotFoundException("Comment could not be loaded after creation.");

        if (book.OwnerId != userId)
        {
            await notificationService.NotifyCommentCreatedAsync(book.OwnerId, new
            {
                type = "CommentCreated",
                bookId = book.Id,
                bookTitle = book.Title,
                commentId = savedComment.Id,
                authorId = user.Id,
                authorName = user.FullName
            });
        }

        if (savedComment.ParentCommentId.HasValue && savedComment.ParentComment is not null && savedComment.ParentComment.UserId != userId)
        {
            await notificationService.NotifyCommentCreatedAsync(savedComment.ParentComment.UserId, new
            {
                type = "CommentReplyCreated",
                bookId = book.Id,
                bookTitle = book.Title,
                commentId = savedComment.Id,
                authorId = user.Id,
                authorName = user.FullName
            });
        }

        var bookComments = await commentRepository.GetBookCommentsAsync(bookId, cancellationToken);
        var topLevelComment = savedComment.ParentCommentId.HasValue
            ? bookComments.First(x => x.Id == savedComment.ParentCommentId.Value)
            : bookComments.First(x => x.Id == savedComment.Id);

        return MapComment(topLevelComment);
    }

    private static CommentResponseDto MapComment(Comment comment)
    {
        return new CommentResponseDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            UserName = comment.User.FullName,
            Content = comment.Content,
            CreatedAtUtc = comment.CreatedAtUtc,
            ParentCommentId = comment.ParentCommentId,
            Replies = comment.Replies
                .OrderBy(x => x.CreatedAtUtc)
                .Select(reply => new CommentReplyDto
                {
                    Id = reply.Id,
                    UserId = reply.UserId,
                    UserName = reply.User.FullName,
                    Content = reply.Content,
                    CreatedAtUtc = reply.CreatedAtUtc
                })
        };
    }
}
