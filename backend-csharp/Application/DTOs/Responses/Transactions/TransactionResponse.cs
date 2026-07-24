using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Responses.Transactions;

public record TransactionResponse(
    Guid Id,
    Guid PlaygroundId,
    Guid PersonId,
    string Description,
    decimal Amount,
    TransactionType Type,
    bool IsPublic,
    ApprovalStatus ApprovalStatus,
    DateTime CreatedAt
);
