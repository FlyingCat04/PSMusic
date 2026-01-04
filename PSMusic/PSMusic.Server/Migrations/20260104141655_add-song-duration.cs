using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PSMusic.Server.Migrations
{
    /// <inheritdoc />
    public partial class addsongduration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "Duration",
                table: "Song",
                type: "interval",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Song");
        }
    }
}
