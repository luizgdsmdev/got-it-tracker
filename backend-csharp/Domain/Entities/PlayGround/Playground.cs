using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Entities.Users;

namespace backend_csharp.Domain.Entities.PlayGround;

public class Playground
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;           // Eg.: "My Playground", "Project X", "Team Y"

    public Guid OwnerId { get; set; }                          // Who created the playground

    public string Description { get; set; } = string.Empty;     // A brief overview of the playground

    public bool AskForApproval { get; set; } = false;          // If true, non-admins need approval in order to create transactions

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    // Relations properties for EF Core
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<PlaygroundMember> Members { get; set; } = [];
    public ICollection<Transaction> Transactions { get; set; } = [];
    public ICollection<ApprovalRequest> ApprovalRequests { get; set; } = [];
}
