using BookCircle.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookCircle.Api.Data.Configurations;

public sealed class BorrowRequestConfiguration : IEntityTypeConfiguration<BorrowRequest>
{
    public void Configure(EntityTypeBuilder<BorrowRequest> builder)
    {
        builder.Property(x => x.Message).HasMaxLength(500);

        builder.HasOne(x => x.Book)
            .WithMany(x => x.BorrowRequests)
            .HasForeignKey(x => x.BookId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Reader)
            .WithMany(x => x.BorrowRequests)
            .HasForeignKey(x => x.ReaderId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
