using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Requests;

public record CreateApprovalRequest(
    Guid PersonId,
    string Description,
    decimal Amount,
    TransactionType Type,
    bool IsPublic
);
