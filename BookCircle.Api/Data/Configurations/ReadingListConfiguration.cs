using BookCircle.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BookCircle.Api.Data.Configurations;

public sealed class ReadingListConfiguration : IEntityTypeConfiguration<ReadingList>
{
    public void Configure(EntityTypeBuilder<ReadingList> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(150).IsRequired();

        builder.HasOne(x => x.User)
            .WithMany(x => x.ReadingLists)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
