using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_artist_name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Artist",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Artist");
        }
    }
}
