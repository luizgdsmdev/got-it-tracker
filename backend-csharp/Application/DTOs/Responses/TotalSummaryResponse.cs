namespace backend_csharp.Application.DTOs.Responses;

public record TotalSummaryResponse(
    Guid PersonId,
    string PersonName,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance
);