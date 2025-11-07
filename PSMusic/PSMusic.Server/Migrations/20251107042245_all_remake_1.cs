using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class all_remake_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SongId",
                table: "Playlist",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Playlist",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Playlist_SongId",
                table: "Playlist",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_Playlist_UserId",
                table: "Playlist",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlist_Song_SongId",
                table: "Playlist",
                column: "SongId",
                principalTable: "Song",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Playlist_User_UserId",
                table: "Playlist",
                column: "UserId",
                principalTable: "User",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlist_Song_SongId",
                table: "Playlist");

            migrationBuilder.DropForeignKey(
                name: "FK_Playlist_User_UserId",
                table: "Playlist");

            migrationBuilder.DropIndex(
                name: "IX_Playlist_SongId",
                table: "Playlist");

            migrationBuilder.DropIndex(
                name: "IX_Playlist_UserId",
                table: "Playlist");

            migrationBuilder.DropColumn(
                name: "SongId",
                table: "Playlist");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Playlist");
        }
    }
}
