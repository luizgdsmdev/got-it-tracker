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
        base.OnModelCreating(modelBuilder);

        // Configurações globais
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Delete Behavior
        modelBuilder.Entity<PlaygroundMember>()
            .HasOne(pm => pm.Playground)
            .WithMany(p => p.Members)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Playground)
            .WithMany(p => p.Transactions)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ApprovalRequest>()
            .HasOne(ar => ar.Playground)
            .WithMany(p => p.ApprovalRequests)
            .OnDelete(DeleteBehavior.Cascade);

        // Quando deletar Person, deleta suas transações
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Person)
            .WithMany(p => p.Transactions)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
