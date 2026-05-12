using BookCircle.Api.Data;
using BookCircle.Api.Models;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Repositories;

public sealed class BookRepository(ApplicationDbContext context) : GenericRepository<Book>(context), IBookRepository
{
    public async Task<Book?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Books
            .Include(x => x.Owner)
            .Include(x => x.Reactions)
            .Include(x => x.BorrowRequests)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<List<Book>> GetBrowseableBooksAsync(string? search, string? genre, string? language, CancellationToken cancellationToken = default)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        
        var query = Context.Books
            .Include(x => x.Owner)
            .Include(x => x.Reactions)
            .Where(x => x.ApprovalStatus == BookApprovalStatus.Approved)
            .Where(x => !x.AvailableFrom.HasValue || x.AvailableFrom <= today)
            .Where(x => !x.AvailableTo.HasValue || x.AvailableTo >= today)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(x => x.Title.ToLower().Contains(term) || x.ISBN.ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(genre))
        {
            var value = genre.Trim().ToLower();
            query = query.Where(x => x.Genre.ToLower() == value);
        }

        if (!string.IsNullOrWhiteSpace(language))
        {
            var value = language.Trim().ToLower();
            query = query.Where(x => x.Language.ToLower() == value);
        }

        return await query
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Book>> GetOwnerBooksAsync(Guid ownerId, CancellationToken cancellationToken = default)
    {
        return await Context.Books
            .Include(x => x.Owner)
            .Include(x => x.Reactions)
            .Where(x => x.OwnerId == ownerId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Book>> GetPendingApprovalBooksAsync(CancellationToken cancellationToken = default)
    {
        return await Context.Books
            .Include(x => x.Owner)
            .Include(x => x.Reactions)
            .Where(x => x.ApprovalStatus == BookApprovalStatus.Pending)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<List<Book>> GetAllBooksAsync(CancellationToken cancellationToken = default)
    {
        return await Context.Books
            .Include(x => x.Owner)
            .Include(x => x.Reactions)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }
}
