using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Requests.Transactions;

public record CreateTransactionRequest(
    Guid PersonId,
    Guid PlaygroundId,
    string Description,
    decimal Amount,
    TransactionType Type,
    DateTime? Date
);
