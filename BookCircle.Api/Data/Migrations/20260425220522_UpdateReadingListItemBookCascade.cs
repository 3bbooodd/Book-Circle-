using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookCircle.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateReadingListItemBookCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReadingListItems_Books_BookId",
                table: "ReadingListItems");

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingListItems_Books_BookId",
                table: "ReadingListItems",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReadingListItems_Books_BookId",
                table: "ReadingListItems");

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingListItems_Books_BookId",
                table: "ReadingListItems",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
