using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.Transactions;

public record CreateApprovalRequest(

    [Required(ErrorMessage = "PlaygroundId is required")]
    Guid PlaygroundId,

    [Required(ErrorMessage = "Description is required"),
     MaxLength(900, ErrorMessage = "Description must be at most 900 characters long.")]
    string Description,

    [Required(ErrorMessage = "Amount is required"),
     Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0.")]
    decimal Amount,

    [Required(ErrorMessage = "Type is required")]
    TransactionType Type,

    [Required(ErrorMessage = "IsPublic is required")]
    bool IsPublic
);
