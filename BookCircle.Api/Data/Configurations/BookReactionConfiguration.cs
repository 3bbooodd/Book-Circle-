using BookCircle.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookCircle.Api.Data.Configurations;

public sealed class BookReactionConfiguration : IEntityTypeConfiguration<BookReaction>
{
    public void Configure(EntityTypeBuilder<BookReaction> builder)
    {
        builder.HasIndex(x => new { x.BookId, x.UserId }).IsUnique();

        builder.HasOne(x => x.Book)
            .WithMany(x => x.Reactions)
            .HasForeignKey(x => x.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.User)
            .WithMany(x => x.BookReactions)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
