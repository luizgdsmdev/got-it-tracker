namespace backend_csharp.Application.DTOs.Responses;

public record OverallSummaryResponse(
    decimal TotalIncome,
    decimal TotalExpense,
    decimal NetBalance,
    int TotalPeople
);
