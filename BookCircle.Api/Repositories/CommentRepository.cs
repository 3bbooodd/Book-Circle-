using BookCircle.Api.Data;
using BookCircle.Api.Models;
using BookCircle.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BookCircle.Api.Repositories;

public sealed class CommentRepository(ApplicationDbContext context) : GenericRepository<Comment>(context), ICommentRepository
{
    public async Task<List<Comment>> GetBookCommentsAsync(Guid bookId, CancellationToken cancellationToken = default)
    {
        return await Context.Comments
            .Include(x => x.User)
            .Include(x => x.Replies)
                .ThenInclude(x => x.User)
            .Where(x => x.BookId == bookId && x.ParentCommentId == null)
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<Comment?> GetDetailedByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await Context.Comments
            .Include(x => x.User)
            .Include(x => x.ParentComment)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }
}
