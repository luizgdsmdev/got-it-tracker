using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities;

public class Person
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "A name is required for person"),
     StringLength(40, ErrorMessage = "Name must be at most 40 characters long."),
     MinLength(1, ErrorMessage = "Name must be at least 1 characters long.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Age is required"),
     Range(12, 150, ErrorMessage = "Age must be between 12 and 150.")]
    public int Age { get; set; }

    [Required(ErrorMessage = "A description is required for person")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<PlaygroundMember> PlaygroundMemberships { get; set; } = [];
    public ICollection<Transaction> Transactions { get; set; } = [];
    public ICollection<ApprovalRequest> ApprovalRequests { get; set; } = [];
}
