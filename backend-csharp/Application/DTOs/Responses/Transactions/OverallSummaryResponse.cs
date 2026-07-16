namespace backend_csharp.Application.DTOs.Responses.Transactions;

public record OverallSummaryResponse(
    decimal TotalIncome,
    decimal TotalExpense,
    decimal NetBalance,
    int TotalPeople
);
