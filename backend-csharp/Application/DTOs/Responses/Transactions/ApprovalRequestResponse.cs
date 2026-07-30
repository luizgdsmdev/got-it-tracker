using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Responses.Transactions;

public record ApprovalRequestResponse(
    Guid Id,
    Guid PersonId,
    Guid TransactionId,
    Guid PlaygroundId,
    string Description,
    decimal Amount,
    TransactionType Type,
    ApprovalStatus Status,
    bool IsPublic,
    DateTime RequestedAt,
    DateTime ReviewedAt,
    Guid? RequestedById,
    Guid? ReviewedById,
    string? ReasonDescription
);
