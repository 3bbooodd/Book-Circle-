using BookCircle.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookCircle.Api.Data.Configurations;

public sealed class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Genre).HasMaxLength(100).IsRequired();
        builder.Property(x => x.ISBN).HasMaxLength(30).IsRequired();
        builder.Property(x => x.Language).HasMaxLength(50).IsRequired();
        builder.Property(x => x.CoverImageUrl).HasMaxLength(500);
        builder.Property(x => x.BorrowPrice).HasPrecision(18, 2);

        builder.HasIndex(x => x.ISBN);

        builder.HasOne(x => x.Owner)
            .WithMany(x => x.OwnedBooks)
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
