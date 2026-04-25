using BookCircle.Api.Data;
using BookCircle.Api.DTOs.BorrowRequests;
using BookCircle.Api.Exceptions;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using BookCircle.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace BookCircle.Api.Services;

public sealed class BorrowRequestService(
    IBookRepository bookRepository,
    IBorrowRequestRepository borrowRequestRepository,
    UserManager<ApplicationUser> userManager,
    INotificationService notificationService) : IBorrowRequestService
{
    public async Task<BorrowRequestResponseDto> CreateAsync(Guid readerId, Guid bookId, CreateBorrowRequestDto request, CancellationToken cancellationToken = default)
    {
        var reader = await userManager.FindByIdAsync(readerId.ToString())
            ?? throw new NotFoundException("Reader account was not found.");

        if (reader.ApprovalStatus != UserApprovalStatus.Approved)
        {
            throw new ForbiddenException("Your account must be approved before sending borrow requests.");
        }

        if (request.RequestedFrom > request.RequestedTo)
        {
            throw new BadRequestException("RequestedFrom must be earlier than or equal to RequestedTo.");
        }

        var book = await bookRepository.GetDetailedByIdAsync(bookId, cancellationToken)
            ?? throw new NotFoundException("Book was not found.");

        if (book.OwnerId == readerId)
        {
            throw new BadRequestException("You cannot borrow your own book.");
        }

        if (book.ApprovalStatus != BookApprovalStatus.Approved)
        {
            throw new BadRequestException("Only approved books can be borrowed.");
        }

        if (book.Status == BookAvailabilityStatus.Borrowed)
        {
            throw new BadRequestException("This book is currently borrowed.");
        }

        if (book.AvailableFrom.HasValue && request.RequestedFrom < book.AvailableFrom.Value)
        {
            throw new BadRequestException("Requested borrow start date is earlier than the available date.");
        }

        if (book.AvailableTo.HasValue && request.RequestedTo > book.AvailableTo.Value)
        {
            throw new BadRequestException("Requested borrow end date is later than the available end date.");
        }

        var exists = await borrowRequestRepository.ExistsActiveRequestAsync(bookId, readerId, cancellationToken);
        if (exists)
        {
            throw new BadRequestException("You already have an active request for this book.");
        }

        var borrowRequest = new BorrowRequest
        {
            BookId = bookId,
            ReaderId = readerId,
            RequestedFrom = request.RequestedFrom,
            RequestedTo = request.RequestedTo,
            Message = request.Message?.Trim(),
            Status = BorrowRequestStatus.Pending
        };

        await borrowRequestRepository.AddAsync(borrowRequest, cancellationToken);
        await borrowRequestRepository.SaveChangesAsync(cancellationToken);

        var savedRequest = await borrowRequestRepository.GetDetailedByIdAsync(borrowRequest.Id, cancellationToken)
            ?? throw new NotFoundException("Borrow request could not be loaded after creation.");

        await notificationService.NotifyBorrowRequestSentAsync(book.OwnerId, new
        {
            type = "BorrowRequestCreated",
            borrowRequestId = savedRequest.Id,
            bookId = savedRequest.BookId,
            bookTitle = savedRequest.Book.Title,
            readerId = savedRequest.ReaderId,
            readerName = savedRequest.Reader.FullName
        });

        return MapBorrowRequest(savedRequest);
    }

    public async Task<BorrowRequestResponseDto> ProcessAsync(Guid ownerId, Guid borrowRequestId, ProcessBorrowRequestDto request, CancellationToken cancellationToken = default)
    {
        var borrowRequest = await borrowRequestRepository.GetDetailedByIdAsync(borrowRequestId, cancellationToken)
            ?? throw new NotFoundException("Borrow request was not found.");

        if (borrowRequest.Book.OwnerId != ownerId)
        {
            throw new ForbiddenException("You can only process requests for your own books.");
        }

        if (borrowRequest.Status != BorrowRequestStatus.Pending)
        {
            throw new BadRequestException("Only pending requests can be processed.");
        }

        borrowRequest.Status = request.Approve ? BorrowRequestStatus.Accepted : BorrowRequestStatus.Rejected;
        borrowRequest.ProcessedAtUtc = DateTime.UtcNow;

        if (request.Approve)
        {
            borrowRequest.Book.Status = BookAvailabilityStatus.Borrowed;

            var otherPendingRequests = await borrowRequestRepository.GetPendingForBookAsync(borrowRequest.BookId, cancellationToken);
            foreach (var pendingRequest in otherPendingRequests.Where(x => x.Id != borrowRequest.Id))
            {
                pendingRequest.Status = BorrowRequestStatus.Rejected;
                pendingRequest.ProcessedAtUtc = DateTime.UtcNow;
                borrowRequestRepository.Update(pendingRequest);

                await notificationService.NotifyBorrowDecisionAsync(pendingRequest.ReaderId, new
                {
                    type = "BorrowRequestUpdated",
                    borrowRequestId = pendingRequest.Id,
                    bookId = pendingRequest.BookId,
                    bookTitle = borrowRequest.Book.Title,
                    status = BorrowRequestStatus.Rejected.ToString()
                });
            }
        }

        borrowRequestRepository.Update(borrowRequest);
        await borrowRequestRepository.SaveChangesAsync(cancellationToken);

        await notificationService.NotifyBorrowDecisionAsync(borrowRequest.ReaderId, new
        {
            type = "BorrowRequestUpdated",
            borrowRequestId = borrowRequest.Id,
            bookId = borrowRequest.BookId,
            bookTitle = borrowRequest.Book.Title,
            status = borrowRequest.Status.ToString()
        });

        return MapBorrowRequest(borrowRequest);
    }

    public async Task<BorrowRequestResponseDto> ReturnBookAsync(Guid ownerId, Guid borrowRequestId, CancellationToken cancellationToken = default)
    {
        var borrowRequest = await borrowRequestRepository.GetDetailedByIdAsync(borrowRequestId, cancellationToken)
            ?? throw new NotFoundException("Borrow request was not found.");

        if (borrowRequest.Book.OwnerId != ownerId)
        {
            throw new ForbiddenException("You can only return books that you own.");
        }

        if (borrowRequest.Status != BorrowRequestStatus.Accepted)
        {
            throw new BadRequestException("Only accepted borrow requests can be returned.");
        }

        if (borrowRequest.Book.Status != BookAvailabilityStatus.Borrowed)
        {
            throw new BadRequestException("This book is not currently borrowed.");
        }

        borrowRequest.Status = BorrowRequestStatus.Returned;
        borrowRequest.Book.Status = BookAvailabilityStatus.Available;

        borrowRequestRepository.Update(borrowRequest);
        await borrowRequestRepository.SaveChangesAsync(cancellationToken);

        await notificationService.NotifyBorrowDecisionAsync(borrowRequest.ReaderId, new
        {
            type = "BorrowRequestUpdated",
            borrowRequestId = borrowRequest.Id,
            bookId = borrowRequest.BookId,
            bookTitle = borrowRequest.Book.Title,
            status = borrowRequest.Status.ToString()
        });

        return MapBorrowRequest(borrowRequest);
    }

    public async Task<IEnumerable<BorrowRequestResponseDto>> GetForReaderAsync(Guid readerId, CancellationToken cancellationToken = default)
    {
        var requests = await borrowRequestRepository.GetForReaderAsync(readerId, cancellationToken);
        return requests.Select(MapBorrowRequest);
    }

    public async Task<IEnumerable<BorrowRequestResponseDto>> GetForOwnerAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        var requests = await borrowRequestRepository.GetForOwnerAsync(ownerId, cancellationToken);
        return requests.Select(MapBorrowRequest);
    }

    private static BorrowRequestResponseDto MapBorrowRequest(BorrowRequest request)
    {
        return new BorrowRequestResponseDto
        {
            Id = request.Id,
            BookId = request.BookId,
            BookTitle = request.Book.Title,
            ReaderId = request.ReaderId,
            ReaderName = request.Reader.FullName,
            RequestedFrom = request.RequestedFrom,
            RequestedTo = request.RequestedTo,
            Message = request.Message,
            Status = request.Status,
            CreatedAtUtc = request.CreatedAtUtc
        };
    }
}
