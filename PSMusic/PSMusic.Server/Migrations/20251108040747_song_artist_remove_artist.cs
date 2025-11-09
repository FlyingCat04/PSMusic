using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class song_artist_remove_artist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_Artist_ArtistId",
                table: "Song");

            migrationBuilder.DropIndex(
                name: "IX_Song_ArtistId",
                table: "Song");

            migrationBuilder.DropColumn(
                name: "ArtistId",
                table: "Song");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SongArtist_Artist_ArtistId1",
                table: "SongArtist");

            migrationBuilder.DropForeignKey(
                name: "FK_SongArtist_Song_SongId1",
                table: "SongArtist");

            migrationBuilder.DropIndex(
                name: "IX_SongArtist_ArtistId1",
                table: "SongArtist");

            migrationBuilder.DropIndex(
                name: "IX_SongArtist_SongId1",
                table: "SongArtist");

            migrationBuilder.DropColumn(
                name: "ArtistId1",
                table: "SongArtist");

            migrationBuilder.DropColumn(
                name: "SongId1",
                table: "SongArtist");

            migrationBuilder.AddColumn<int>(
                name: "ArtistId",
                table: "Song",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Song_ArtistId",
                table: "Song",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Song_Artist_ArtistId",
                table: "Song",
                column: "ArtistId",
                principalTable: "Artist",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
