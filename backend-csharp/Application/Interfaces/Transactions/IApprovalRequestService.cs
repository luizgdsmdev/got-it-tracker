using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Domain.Entities.Transactions;

namespace backend_csharp.Application.Interfaces.Transactions;

public interface IApprovalRequestService
{
    Task<ApprovalRequestResponse?> CreateIfNeededAsync(Transaction transaction, Guid currentUserId);
    Task<ApprovalRequestResponse> GetByIdAsync(Guid id);
    Task<ApprovalRequestResponse> ApproveAsync(AcceptApprovalRequest requestApproval);
    Task<ApprovalRequestResponse> RejectAsync(RejectApprovalRequest requestReject);
    Task<IEnumerable<ApprovalRequestResponse>> GetPendingByPlaygroundAsync(Guid playgroundId);
}
