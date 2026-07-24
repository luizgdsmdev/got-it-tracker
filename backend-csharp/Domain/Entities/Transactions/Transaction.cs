using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Domain.Entities.Transactions;

public class Transaction
{
    public Guid Id { get; set; }

    public Guid PlaygroundId { get; set; }

    public Guid PersonId { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public bool IsPublic { get; set; } = true;

    public DateTime CreatedAt { get; set; }

    public ApprovalStatus ApprovalStatus { get; set; }

    public Playground Playground { get; set; } = null!;

    public Person Person { get; set; } = null!;
}
