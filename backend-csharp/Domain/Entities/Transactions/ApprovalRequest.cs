using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Domain.Entities.Transactions;

public class ApprovalRequest
{
    public Guid Id { get; set; }

    public Guid PlaygroundId { get; set; }

    public Guid PersonId { get; set; }

    public Guid? RequestedById { get; set; }           // User who requested

    public Guid? ReviewedById { get; set; }           // Admin who approved/rejected

    public string? Description { get; set; }

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public bool IsPublic { get; set; } = true;        // Visibility for non-admins

    public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;

    public string? ReasonDescription { get; set; }

    public DateTime? RequestedAt { get; set; }

    public DateTime? ReviewedAt { get; set; }

    public Person? Person { get; set; }

    public User? RequestedBy { get; set; }

    public User? ReviewedBy { get; set; }

    public Playground? Playground { get; set; }
}
