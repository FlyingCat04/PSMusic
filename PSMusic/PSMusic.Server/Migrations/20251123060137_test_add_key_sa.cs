using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class test_add_key_sa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SongArtist",
                table: "SongArtist");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SongArtist",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SongArtist",
                table: "SongArtist",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_SongArtist_SongId",
                table: "SongArtist",
                column: "SongId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_SongArtist",
                table: "SongArtist");

            migrationBuilder.DropIndex(
                name: "IX_SongArtist_SongId",
                table: "SongArtist");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "SongArtist",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SongArtist",
                table: "SongArtist",
                columns: new[] { "SongId", "ArtistId" });
        }
    }
}
