using BookCircle.Api.Data;
using BookCircle.Api.DTOs.Books;
using BookCircle.Api.Exceptions;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Services;

public sealed class BookService(
    IBookRepository bookRepository,
    IGenericRepository<BookReaction> reactionRepository,
    UserManager<ApplicationUser> userManager) : IBookService
{
    public async Task<IEnumerable<BookResponseDto>> BrowseAsync(Guid? currentUserId, string? search, string? genre, string? language, CancellationToken cancellationToken = default)
    {
        var books = await bookRepository.GetBrowseableBooksAsync(search, genre, language, cancellationToken);
        return books.Select(b => MapBook(b, currentUserId));
    }

    public async Task<BookResponseDto> GetByIdAsync(Guid? currentUserId, Guid bookId, CancellationToken cancellationToken = default)
    {
        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.ApprovalStatus != BookApprovalStatus.Approved)
        {
            throw new ForbiddenException("This book is not publicly available.");
        }

        return MapBook(book, currentUserId);
    }

    public async Task<IEnumerable<BookResponseDto>> GetOwnerBooksAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        var books = await bookRepository.GetOwnerBooksAsync(ownerId, cancellationToken);
        return books.Select(b => MapBook(b, ownerId));
    }

    public async Task<BookResponseDto> CreateAsync(Guid ownerId, BookCreateRequestDto request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnerApprovedAsync(ownerId);
        ValidateAvailabilityDates(request.AvailableFrom, request.AvailableTo);

        var book = new Book
        {
            Title = request.Title.Trim(),
            Genre = request.Genre.Trim(),
            ISBN = request.ISBN.Trim(),
            Language = request.Language.Trim(),
            PublicationDate = request.PublicationDate,
            BorrowPrice = request.BorrowPrice,
            AvailableFrom = request.AvailableFrom,
            AvailableTo = request.AvailableTo,
            CoverImageUrl = request.CoverImageUrl,
            OwnerId = ownerId,
            Status = BookAvailabilityStatus.Available,
            ApprovalStatus = BookApprovalStatus.Pending
        };

        await bookRepository.AddAsync(book, cancellationToken);
        await bookRepository.SaveChangesAsync(cancellationToken);

        var createdBook = await bookRepository.GetDetailedByIdAsync(book.Id, cancellationToken)
            ?? throw new NotFoundException("Created book could not be loaded.");

        return MapBook(createdBook, ownerId);
    }

    public async Task<BookResponseDto> UpdateAsync(Guid ownerId, Guid bookId, BookUpdateRequestDto request, CancellationToken cancellationToken = default)
    {
        ValidateAvailabilityDates(request.AvailableFrom, request.AvailableTo);

        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.OwnerId != ownerId)
        {
            throw new ForbiddenException("You can only update your own books.");
        }

        book.Title = request.Title.Trim();
        book.Genre = request.Genre.Trim();
        book.ISBN = request.ISBN.Trim();
        book.Language = request.Language.Trim();
        book.PublicationDate = request.PublicationDate;
        book.BorrowPrice = request.BorrowPrice;
        book.AvailableFrom = request.AvailableFrom;
        book.AvailableTo = request.AvailableTo;
        book.CoverImageUrl = request.CoverImageUrl;
        book.ApprovalStatus = BookApprovalStatus.Pending;

        bookRepository.Update(book);
        await bookRepository.SaveChangesAsync(cancellationToken);

        return MapBook(book, ownerId);
    }

    public async Task DeleteAsync(Guid ownerId, Guid bookId, CancellationToken cancellationToken = default)
    {
        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.OwnerId != ownerId)
        {
            throw new ForbiddenException("You can only delete your own books.");
        }

        if (book.Status == BookAvailabilityStatus.Borrowed)
        {
            throw new BadRequestException("Borrowed books cannot be deleted.");
        }

        bookRepository.Remove(book);
        await bookRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task<BookResponseDto> ReactAsync(Guid userId, Guid bookId, BookReactionRequestDto request, CancellationToken cancellationToken = default)
    {
        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.ApprovalStatus != BookApprovalStatus.Approved)
        {
            throw new BadRequestException("You can only react to approved books.");
        }

        var existingReaction = book.Reactions.FirstOrDefault(x => x.UserId == userId);
        if (existingReaction is null)
        {
            existingReaction = new BookReaction
            {
                BookId = bookId,
                UserId = userId,
                IsLike = request.IsLike
            };

            await reactionRepository.AddAsync(existingReaction, cancellationToken);
        }
        else if (existingReaction.IsLike == request.IsLike)
        {
            // If user sends the same reaction, remove it (toggle)
            reactionRepository.Remove(existingReaction);
        }
        else
        {
            existingReaction.IsLike = request.IsLike;
            reactionRepository.Update(existingReaction);
        }

        await reactionRepository.SaveChangesAsync(cancellationToken);

        var updatedBook = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found after updating reaction.");

        return MapBook(updatedBook, userId);
    }

    private async Task EnsureOwnerApprovedAsync(Guid ownerId)
    {
        var owner = await userManager.FindByIdAsync(ownerId.ToString())
            ?? throw new NotFoundException("Owner account was not found.");

        if (owner.ApprovalStatus != UserApprovalStatus.Approved)
        {
            throw new ForbiddenException("Your account must be approved before managing books.");
        }
    }

    private static void ValidateAvailabilityDates(DateOnly? availableFrom, DateOnly? availableTo)
    {
        if (availableFrom.HasValue && availableTo.HasValue && availableFrom > availableTo)
        {
            throw new BadRequestException("AvailableFrom must be earlier than or equal to AvailableTo.");
        }
    }

    private static BookResponseDto MapBook(Book book, Guid? currentUserId = null)
    {
        var reaction = currentUserId.HasValue 
            ? book.Reactions.FirstOrDefault(x => x.UserId == currentUserId.Value)
            : null;

        return new BookResponseDto
        {
            Id = book.Id,
            Title = book.Title,
            Genre = book.Genre,
            ISBN = book.ISBN,
            Language = book.Language,
            PublicationDate = book.PublicationDate,
            BorrowPrice = book.BorrowPrice,
            Status = book.Status,
            AvailableFrom = book.AvailableFrom,
            AvailableTo = book.AvailableTo,
            CoverImageUrl = book.CoverImageUrl,
            OwnerId = book.OwnerId,
            OwnerName = book.Owner.FullName,
            ApprovalStatus = book.ApprovalStatus,
            LikesCount = book.Reactions.Count(x => x.IsLike),
            DislikesCount = book.Reactions.Count(x => !x.IsLike),
            UserReaction = reaction?.IsLike == true ? "Like" : (reaction?.IsLike == false ? "Dislike" : null)
        };
    }
}
