using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Responses;

public record TransactionResponse(
    Guid Id,
    Guid PersonId,
    string Description,
    decimal Amount,
    TransactionType Type,
    DateTime Date
);
