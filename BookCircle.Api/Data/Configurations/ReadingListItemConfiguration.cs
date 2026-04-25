using BookCircle.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookCircle.Api.Data.Configurations;

public sealed class ReadingListItemConfiguration : IEntityTypeConfiguration<ReadingListItem>
{
    public void Configure(EntityTypeBuilder<ReadingListItem> builder)
    {
        builder.HasIndex(x => new { x.ReadingListId, x.BookId }).IsUnique();

        builder.HasOne(x => x.ReadingList)
            .WithMany(x => x.Items)
            .HasForeignKey(x => x.ReadingListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Book)
            .WithMany(x => x.ReadingListItems)
            .HasForeignKey(x => x.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
