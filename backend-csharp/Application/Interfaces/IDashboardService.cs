using backend_csharp.Application.DTOs.Responses.Transactions;

namespace backend_csharp.Application.Interfaces;

public interface IDashboardService
{
    Task<IEnumerable<TotalSummaryResponse>> GetPlaygroundSummaryAsync(Guid playgroundId, Guid currentUserId);
    Task<OverallSummaryResponse> GetOverallSummaryAsync(Guid playgroundId, Guid currentUserId);
}
