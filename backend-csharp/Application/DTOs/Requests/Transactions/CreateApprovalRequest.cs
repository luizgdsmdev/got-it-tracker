using backend_csharp.Domain.Entities;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Requests.Transactions;

public record CreateApprovalRequest(
    Guid PersonId,
    Guid PlaygroundId,
    string Description,
    decimal Amount,
    TransactionType Type,
    bool IsPublic
);
