using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_csharp.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 40, nullable: false),
                    Age = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Playgrounds",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    OwnerId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AskForApproval = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playgrounds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    LastUpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlaygroundMembers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PlaygroundId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PersonId = table.Column<Guid>(type: "TEXT", nullable: false),
                    IsAdmin = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaygroundMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlaygroundMembers_People_PersonId",
                        column: x => x.PersonId,
                        principalTable: "People",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlaygroundMembers_Playgrounds_PlaygroundId",
                        column: x => x.PlaygroundId,
                        principalTable: "Playgrounds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PlaygroundId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PersonId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_People_PersonId",
                        column: x => x.PersonId,
                        principalTable: "People",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transactions_Playgrounds_PlaygroundId",
                        column: x => x.PlaygroundId,
                        principalTable: "Playgrounds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApprovalRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    PlaygroundId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PersonId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RequestedById = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReviewedById = table.Column<Guid>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    Amount = table.Column<decimal>(type: "TEXT", nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    IsPublic = table.Column<bool>(type: "INTEGER", nullable: false),
                    Status = table.Column<int>(type: "INTEGER", nullable: false),
                    RejectionReason = table.Column<string>(type: "TEXT", maxLength: 400, nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApprovalRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApprovalRequests_People_PersonId",
                        column: x => x.PersonId,
                        principalTable: "People",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApprovalRequests_Playgrounds_PlaygroundId",
                        column: x => x.PlaygroundId,
                        principalTable: "Playgrounds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApprovalRequests_Users_RequestedById",
                        column: x => x.RequestedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApprovalRequests_Users_ReviewedById",
                        column: x => x.ReviewedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequests_PersonId",
                table: "ApprovalRequests",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequests_PlaygroundId",
                table: "ApprovalRequests",
                column: "PlaygroundId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequests_RequestedById",
                table: "ApprovalRequests",
                column: "RequestedById");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalRequests_ReviewedById",
                table: "ApprovalRequests",
                column: "ReviewedById");

            migrationBuilder.CreateIndex(
                name: "IX_PlaygroundMembers_PersonId",
                table: "PlaygroundMembers",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaygroundMembers_PlaygroundId",
                table: "PlaygroundMembers",
                column: "PlaygroundId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_PersonId",
                table: "Transactions",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_PlaygroundId",
                table: "Transactions",
                column: "PlaygroundId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApprovalRequests");

            migrationBuilder.DropTable(
                name: "PlaygroundMembers");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "People");

            migrationBuilder.DropTable(
                name: "Playgrounds");
        }
    }
}
