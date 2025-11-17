using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class init_with_role : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "User",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Type",
                table: "User");
        }
    }
}
