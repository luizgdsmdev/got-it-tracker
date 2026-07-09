using backend_csharp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Playground> Playgrounds { get; set; }
    public DbSet<PlaygroundMember> PlaygroundMembers { get; set; }
    public DbSet<Person> People { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<ApprovalRequest> ApprovalRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
