using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Responses.Transactions;

public record ApprovalRequestResponse(
    Guid Id,
    Guid PersonId,
    string Description,
    decimal Amount,
    TransactionType Type,
    ApprovalStatus Status,
    bool IsPublic,
    DateTime RequestedAt,
    string? RejectionReason
);
