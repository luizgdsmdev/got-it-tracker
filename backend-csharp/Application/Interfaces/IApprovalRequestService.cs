using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;

namespace backend_csharp.Application.Interfaces;

public interface IApprovalRequestService
{
    Task<ApprovalRequestResponse> CreateAsync(CreateApprovalRequest request, Guid currentUserId);
    Task<ApprovalRequestResponse> ApproveAsync(Guid requestId, Guid adminUserId, string? notes = null);
    Task<ApprovalRequestResponse> RejectAsync(Guid requestId, Guid adminUserId, string rejectionReason);
    Task<IEnumerable<ApprovalRequestResponse>> GetPendingAsync(Guid playgroundId, Guid currentUserId);
    Task<IEnumerable<ApprovalRequestResponse>> GetMyRequestsAsync(Guid userId);
}
