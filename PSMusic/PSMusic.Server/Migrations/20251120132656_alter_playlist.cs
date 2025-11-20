using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class alter_playlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlist_Song_SongId",
                table: "Playlist");

            migrationBuilder.DropIndex(
                name: "IX_Playlist_SongId",
                table: "Playlist");

            migrationBuilder.DropColumn(
                name: "SongId",
                table: "Playlist");

            migrationBuilder.RenameColumn(
                name: "AvatarURL",
                table: "Artist",
                newName: "AvatarUrl");

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Song",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Artist",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "SongPlaylist",
                columns: table => new
                {
                    SongId = table.Column<int>(type: "integer", nullable: false),
                    PlaylistId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongPlaylist", x => new { x.SongId, x.PlaylistId });
                    table.ForeignKey(
                        name: "FK_SongPlaylist_Playlist_PlaylistId",
                        column: x => x.PlaylistId,
                        principalTable: "Playlist",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SongPlaylist_Song_SongId",
                        column: x => x.SongId,
                        principalTable: "Song",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SongPlaylist_PlaylistId",
                table: "SongPlaylist",
                column: "PlaylistId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SongPlaylist");

            migrationBuilder.RenameColumn(
                name: "AvatarUrl",
                table: "Artist",
                newName: "AvatarURL");

            migrationBuilder.AlterColumn<string>(
                name: "AvatarUrl",
                table: "Song",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SongId",
                table: "Playlist",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "AvatarURL",
                table: "Artist",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Playlist_SongId",
                table: "Playlist",
                column: "SongId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlist_Song_SongId",
                table: "Playlist",
                column: "SongId",
                principalTable: "Song",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
