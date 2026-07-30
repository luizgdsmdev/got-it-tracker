using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Entities.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

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

        // ============================================================
        // DELETE BEHAVIOR CONFIGURATION
        // ============================================================
        //
        // Regras definidas:
        //
        // User
        //  └── Playground                  Cascade
        //
        // Playground
        //  ├── Members                     Cascade
        //  ├── Transactions                Cascade
        //  └── ApprovalRequests            Cascade
        //
        // Person
        //  ├── Members                     Cascade
        //  ├── Transactions                Cascade
        //  └── ApprovalRequests            Cascade
        //
        // User
        //  ├── RequestedBy                  SetNull
        //  └── ReviewedBy                   SetNull
        //
        // ============================================================



        // ============================================================
        // USER -> PLAYGROUND
        //
        // Um Playground pertence a um User.
        //
        // Ao excluir um User:
        // - Todos os seus Playgrounds serão excluídos.
        // - Os relacionamentos abaixo do Playground serão tratados
        //   automaticamente pelos cascades seguintes.
        //
        // Exemplo:
        //
        // User
        //   └── Playground
        //          ├── Transactions
        //          ├── Members
        //          └── ApprovalRequests
        //
        // ============================================================
        modelBuilder.Entity<Playground>()
            .HasOne(p => p.User)
            .WithMany(u => u.Playgrounds)
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);



        // ============================================================
        // USER -> PERSON
        //
        // Um User possui uma única Person.
        //
        // Uma Person pode existir sem um User
        // (participante convidado).
        //
        // Ao excluir um User:
        // - O vínculo será removido.
        // - A Person continuará existindo.
        // - UserId será definido como NULL.
        //
        // Exemplo:
        //
        // User
        //   └── Person
        //
        // ============================================================
        modelBuilder.Entity<Person>()
            .HasOne(p => p.User)
            .WithOne(u => u.Person)
            .HasForeignKey<Person>(p => p.UserId)
            .OnDelete(DeleteBehavior.SetNull);



        // ============================================================
        // USER -> APPROVAL REQUEST (RequestedBy)
        //
        // NÃO usamos Cascade.
        //
        // Motivo:
        // O User pode ter criado solicitações que precisam continuar
        // existindo como histórico.
        //
        // Caso o User seja excluído:
        // RequestedById será definido como NULL.
        //
        // ============================================================
        modelBuilder.Entity<ApprovalRequest>()
            .HasOne(ar => ar.RequestedBy)
            .WithMany(u => u.RequestedApprovals)
            .HasForeignKey(ar => ar.RequestedById)
            .OnDelete(DeleteBehavior.SetNull);



        // ============================================================
        // USER -> APPROVAL REQUEST (ReviewedBy)
        //
        // NÃO usamos Cascade.
        //
        // Motivo:
        // Queremos preservar o histórico da aprovação/rejeição.
        //
        // Caso o administrador seja excluído:
        // ReviewedById será definido como NULL.
        //
        // ============================================================
        modelBuilder.Entity<ApprovalRequest>()
            .HasOne(ar => ar.ReviewedBy)
            .WithMany(u => u.ReviewedApprovals)
            .HasForeignKey(ar => ar.ReviewedById)
            .OnDelete(DeleteBehavior.SetNull);


        // ============================================================
        // PERSON -> PLAYGROUND MEMBERS
        //
        // Uma participação de uma Person em um Playground
        // deixa de existir quando a Person é removida.
        //
        // Ao excluir uma Person:
        // - Todos os vínculos dela com Playgrounds serão removidos.
        //
        // ============================================================
        modelBuilder.Entity<PlaygroundMember>()
            .HasOne(pm => pm.Person)
            .WithMany(p => p.PlaygroundMemberships)
            .HasForeignKey(pm => pm.PersonId)
            .OnDelete(DeleteBehavior.Cascade);

        // ============================================================
        // PERSON -> TRANSACTIONS
        //
        // Uma Transaction pertence a uma Person.
        //
        // Ao excluir uma Person:
        // - Todas as Transactions relacionadas serão removidas.
        //
        // ============================================================
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Person)
            .WithMany(p => p.Transactions)
            .HasForeignKey(t => t.PersonId)
            .OnDelete(DeleteBehavior.Cascade);


        // ============================================================
        // PERSON -> APPROVAL REQUESTS
        //
        // Uma ApprovalRequest pertence a uma Person.
        //
        // Ao excluir uma Person:
        // - Todas as solicitações criadas para essa Person serão removidas.
        //
        // ============================================================
        modelBuilder.Entity<ApprovalRequest>()
            .HasOne(ar => ar.Person)
            .WithMany(p => p.ApprovalRequests)
            .HasForeignKey(ar => ar.PersonId)
            .OnDelete(DeleteBehavior.Cascade);



        // ============================================================
        // PLAYGROUND MEMBER
        //
        // Chave composta.
        //
        // Uma Person só pode participar uma única vez
        // de um determinado Playground.
        //
        // ============================================================
        modelBuilder.Entity<PlaygroundMember>()
            .HasKey(pm => new
            {
                pm.PlaygroundId,
                pm.PersonId
            });



        // ============================================================
        // PLAYGROUND -> PLAYGROUND MEMBERS
        //
        // Um membro não existe sem um Playground.
        //
        // Ao excluir um Playground:
        // - Todos os membros associados serão removidos.
        //
        // ============================================================
        modelBuilder.Entity<PlaygroundMember>()
            .HasOne(pm => pm.Playground)
            .WithMany(p => p.Members)
            .HasForeignKey(pm => pm.PlaygroundId)
            .OnDelete(DeleteBehavior.Cascade);


        // ============================================================
        // PLAYGROUND -> TRANSACTIONS
        //
        // Uma Transaction pertence a um Playground.
        //
        // Ao excluir um Playground:
        // - Todas as Transactions relacionadas serão removidas.
        //
        // ============================================================
        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Playground)
            .WithMany(p => p.Transactions)
            .HasForeignKey(t => t.PlaygroundId)
            .OnDelete(DeleteBehavior.Cascade);


        // ============================================================
        // PLAYGROUND -> APPROVAL REQUESTS
        //
        // Uma ApprovalRequest pertence a um Playground.
        //
        // Ao excluir um Playground:
        // - Todas as solicitações de aprovação serão removidas.
        //
        // ============================================================
        modelBuilder.Entity<ApprovalRequest>()
            .HasOne(ar => ar.Playground)
            .WithMany(p => p.ApprovalRequests)
            .HasForeignKey(ar => ar.PlaygroundId)
            .OnDelete(DeleteBehavior.Cascade);
        
    }
}
