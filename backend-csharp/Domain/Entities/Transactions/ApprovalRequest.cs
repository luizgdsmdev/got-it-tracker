using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace backend_csharp.Domain.Entities.Transactions;

public class ApprovalRequest
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "PlaygroundId is required")]
    public Guid PlaygroundId { get; set; }

    [Required(ErrorMessage = "PersonId is required")]
    public Guid PersonId { get; set; }

    [Required (ErrorMessage = "RequestedById is required")]
    public Guid? RequestedById { get; set; }           // User who requested

    [Required (ErrorMessage = "ReviewedById is required")]
    public Guid? ReviewedById { get; set; }           // Admin who approved/rejected

    [Required(ErrorMessage = "A Description is required for approval requests."),
    StringLength(400, ErrorMessage = "Description must be at most 400 characters long."),
    MinLength(1, ErrorMessage = "Description must be at least 1 characters long.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Amount is required"),
     Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Transaction Type is required")]
    public TransactionType Type { get; set; }

    [Required(ErrorMessage = "IsPublic is required")]
    public bool IsPublic { get; set; } = true;        // Visibility for non-admins

    [Required(ErrorMessage = "Status is required")]
    public ApprovalStatus Status { get; set; } = ApprovalStatus.Pending;

    [Required(ErrorMessage = "Rejection reason is required when status is Rejected."),
     StringLength(400, ErrorMessage = "Rejection reason must be at most 400 characters long."),
     MinLength(1, ErrorMessage = "Rejection reason must be at least 1 characters long.")]
    public string? RejectionReason { get; set; }

    [Required(ErrorMessage = "RequestedAt is required")]
    public DateTime? RequestedAt { get; set; }

    [Required(ErrorMessage = "ReviewedAt is required when status is Approved or Rejected.")]
    public DateTime? ReviewedAt { get; set; }

    public Person? Person { get; set; }

    public User? RequestedBy { get; set; }

    public User? ReviewedBy { get; set; }

    public Playground? Playground { get; set; }
}
