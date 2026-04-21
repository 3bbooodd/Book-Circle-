using BookCircle.Api.DTOs.BorrowRequests;

namespace BookCircle.Api.Services.Interfaces;

public interface IBorrowRequestService
{
    Task<BorrowRequestResponseDto> CreateAsync(Guid readerId, Guid bookId, CreateBorrowRequestDto request, CancellationToken cancellationToken = default);
    Task<BorrowRequestResponseDto> ProcessAsync(Guid ownerId, Guid borrowRequestId, ProcessBorrowRequestDto request, CancellationToken cancellationToken = default);
    Task<IEnumerable<BorrowRequestResponseDto>> GetForReaderAsync(Guid readerId, CancellationToken cancellationToken = default);
    Task<IEnumerable<BorrowRequestResponseDto>> GetForOwnerAsync(Guid ownerId, CancellationToken cancellationToken = default);
}
