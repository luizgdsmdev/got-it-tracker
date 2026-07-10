using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities;

public class Playground
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Playground name is required."),
     StringLength(100, ErrorMessage = "Playground name cannot exceed 100 characters."),
     MinLength(3, ErrorMessage = "Playground name must be at least 3 characters long.")]
    public string Name { get; set; } = string.Empty;           // Eg.: "My Playground", "Project X", "Team Y"

    [Required(ErrorMessage = "Playground description is required.")]
    public Guid OwnerId { get; set; }                          // Who created the playground

    [Required(ErrorMessage = "Playground description is required.")]
    public bool AskForApproval { get; set; } = false;          // If true, non-admins need approval in order to create transactions

    [Required(ErrorMessage = "Playground description is required.")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<PlaygroundMember> Members { get; set; } = [];
    public ICollection<Transaction> Transactions { get; set; } = [];
    public ICollection<ApprovalRequest> ApprovalRequests { get; set; } = [];
}
