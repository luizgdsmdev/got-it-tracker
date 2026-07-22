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

    public string? Description { get; set; }

    public decimal Amount { get; set; }

    public TransactionType Type { get; set; }

    public DateTime? Date { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Playground Playground { get; set; } = null!;

    [Required(ErrorMessage = "Person is required")]
    public Person Person { get; set; } = null!;
}
