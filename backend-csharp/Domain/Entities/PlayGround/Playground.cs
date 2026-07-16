using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Entities.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities.PlayGround;

public class Playground
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "Playground name is required."),
     StringLength(100, ErrorMessage = "Playground name cannot exceed 100 characters."),
     MinLength(3, ErrorMessage = "Playground name must be at least 3 characters long.")]
    public string Name { get; set; } = string.Empty;           // Eg.: "My Playground", "Project X", "Team Y"



    [Required(ErrorMessage = "Playground Owner ID is required.")]
    public Guid OwnerId { get; set; }                          // Who created the playground



    [Required(ErrorMessage = "Playground description is required."),
     StringLength(400, ErrorMessage = "Playground description cannot exceed 400 characters."),]
    public string Description { get; set; } = string.Empty;     // A brief overview of the playground



    [Required(ErrorMessage = "Approval requirement is required.")]
    public bool AskForApproval { get; set; } = false;          // If true, non-admins need approval in order to create transactions



    [Required(ErrorMessage = "Playground CreatedAt is required.")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    // Relations properties for EF Core
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<PlaygroundMember> Members { get; set; } = [];
    public ICollection<Transaction> Transactions { get; set; } = [];
    public ICollection<ApprovalRequest> ApprovalRequests { get; set; } = [];
}
