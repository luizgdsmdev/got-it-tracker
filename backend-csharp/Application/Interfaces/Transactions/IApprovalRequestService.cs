using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Domain.Entities.Transactions;

namespace backend_csharp.Application.Interfaces.Transactions;

public interface IApprovalRequestService
{
    Task<ApprovalRequestResponse?> CreateIfNeededAsync(Transaction transaction);
    Task<ApprovalRequestResponse> GetByIdAsync(Guid id);
    Task<ApprovalRequestResponse> ApproveAsync(Guid approvalRequestId);
    Task<ApprovalRequestResponse> RejectAsync(Guid approvalRequestId);
    Task<IEnumerable<ApprovalRequestResponse>> GetPendingByPlaygroundAsync(Guid playgroundId);
}
