using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities.Transactions;

public class Transaction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "PlaygroundId is required")]
    public Guid PlaygroundId { get; set; }


    [Required(ErrorMessage = "PersonId is required")]
    public Guid PersonId { get; set; }

    [Required(ErrorMessage = "Description is required"),
     StringLength(400, ErrorMessage = "Description cannot be longer than 400 characters"),
     MinLength(1, ErrorMessage = "Description cannot be empty")]
    public string? Description { get; set; }


    [Required(ErrorMessage = "Amount is required"),
     Range(0.01, double.MaxValue, ErrorMessage = "Amount must be a positive value")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Type is required")]
    public TransactionType Type { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateTime? Date { get; set; }

    [Required(ErrorMessage = "CreatedAt is required")]
    public DateTime? CreatedAt { get; set; }

    [Required(ErrorMessage = "Playground is required")]
    public Playground Playground { get; set; } = null!;

    [Required(ErrorMessage = "Person is required")]
    public Person Person { get; set; } = null!;
}
