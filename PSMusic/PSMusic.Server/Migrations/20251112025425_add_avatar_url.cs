using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_avatar_url : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Song",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Playlist",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Song");

            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Playlist");
        }
    }
}
