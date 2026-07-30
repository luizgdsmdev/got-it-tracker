using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.Transactions;

public record UpdateTransactionRequest(

    [Required(ErrorMessage = "Description is required.")]
    [MinLength(3, ErrorMessage = "Description must be at least 3 characters long.")]
    [MaxLength(150, ErrorMessage = "Description must be at most 150 characters long.")]
    string Description,

    [Required(ErrorMessage = "Amount is required.")]
    [Range(typeof(decimal), "0,01", "999999999,99",
     ErrorMessage = "Amount must be greater than zero.")]
    decimal Amount,

    [Required(ErrorMessage = "Transaction type is required.")]
    TransactionType Type,

    [Required(ErrorMessage = "Transaction date is required.")]
    DateTime TransactionDate
);
