using BookCircle.Api.Data;
using BookCircle.Api.Models;
using BookCircle.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Repositories;

public sealed class ReadingListRepository(ApplicationDbContext context) : GenericRepository<ReadingList>(context), IReadingListRepository
{
    public async Task<List<ReadingList>> GetByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await Context.ReadingLists
            .Include(x => x.Items)
                .ThenInclude(x => x.Book)
                    .ThenInclude(x => x.Owner)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<ReadingList?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.ReadingLists
            .Include(x => x.Items)
                .ThenInclude(x => x.Book)
                    .ThenInclude(x => x.Owner)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}
