using BookCircle.Api.DTOs.ReadingLists;
using BookCircle.Api.Exceptions;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;

namespace BookCircle.Api.Services;

public sealed class ReadingListService(
    IReadingListRepository readingListRepository,
    IBookRepository bookRepository,
    IGenericRepository<ReadingListItem> readingListItemRepository) : IReadingListService
{
    public async Task<IEnumerable<ReadingListResponseDto>> GetUserListsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var lists = await readingListRepository.GetByUserIdAsync(userId, cancellationToken);
        return lists.Select(MapReadingList);
    }

    public async Task<ReadingListResponseDto> CreateAsync(Guid userId, CreateReadingListRequestDto request, CancellationToken cancellationToken = default)
    {
        var list = new ReadingList
        {
            Name = request.Name.Trim(),
            UserId = userId
        };

        await readingListRepository.AddAsync(list, cancellationToken);
        await readingListRepository.SaveChangesAsync(cancellationToken);

        var savedList = await readingListRepository.GetDetailedByIdAsync(list.Id, cancellationToken)
            ?? throw new NotFoundException("Reading list could not be loaded after creation.");

        return MapReadingList(savedList);
    }

    public async Task<ReadingListResponseDto> AddBookAsync(Guid userId, Guid readingListId, AddBookToReadingListRequestDto request, CancellationToken cancellationToken = default)
    {
        var list = await readingListRepository.GetDetailedByIdAsync(readingListId, cancellationToken)
            ?? throw new NotFoundException("Reading list was not found.");

        if (list.UserId != userId)
        {
            throw new ForbiddenException("You can only manage your own reading lists.");
        }

        var book = await bookRepository.GetDetailedByIdAsync(request.BookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.ApprovalStatus != BookApprovalStatus.Approved)
        {
            throw new BadRequestException("Only approved books can be added to a reading list.");
        }

        if (list.Items.Any(x => x.BookId == request.BookId))
        {
            throw new BadRequestException("This book already exists in the selected reading list.");
        }

        var item = new ReadingListItem
        {
            ReadingListId = readingListId,
            BookId = request.BookId
        };

        await readingListItemRepository.AddAsync(item, cancellationToken);
        await readingListItemRepository.SaveChangesAsync(cancellationToken);

        var updatedList = await readingListRepository.GetDetailedByIdAsync(readingListId, cancellationToken)
            ?? throw new NotFoundException("Reading list was not found after update.");

        return MapReadingList(updatedList);
    }

    public async Task RemoveBookAsync(Guid userId, Guid readingListId, Guid bookId, CancellationToken cancellationToken = default)
    {
        var list = await readingListRepository.GetDetailedByIdAsync(readingListId, cancellationToken)
            ?? throw new NotFoundException("Reading list was not found.");

        if (list.UserId != userId)
        {
            throw new ForbiddenException("You can only manage your own reading lists.");
        }

        var item = list.Items.FirstOrDefault(x => x.BookId == bookId)
            ?? throw new NotFoundException("Book was not found in the selected reading list.");

        readingListItemRepository.Remove(item);
        await readingListItemRepository.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteListAsync(Guid userId, Guid readingListId, CancellationToken cancellationToken = default)
    {
        var list = await readingListRepository.GetByIdAsync(readingListId, cancellationToken)
            ?? throw new NotFoundException("Reading list was not found.");

        if (list.UserId != userId)
        {
            throw new ForbiddenException("You can only delete your own reading lists.");
        }

        readingListRepository.Remove(list);
        await readingListRepository.SaveChangesAsync(cancellationToken);
    }

    private static ReadingListResponseDto MapReadingList(ReadingList list)
    {
        return new ReadingListResponseDto
        {
            Id = list.Id,
            Name = list.Name,
            Items = list.Items.Select(item => new ReadingListItemDto
            {
                BookId = item.BookId,
                BookTitle = item.Book.Title,
                CoverImageUrl = item.Book.CoverImageUrl,
                Status = item.Book.Status,
                OwnerName = item.Book.Owner.FullName
            })
        };
    }
}
