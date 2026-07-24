using backend_csharp.Domain.Entities.Transactions;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IApprovalRequestRepository
{
    Task<ApprovalRequest?> CreateAsync(ApprovalRequest request);
    Task<ApprovalRequest?> GetByIdAsync(Guid id);
    Task<IEnumerable<ApprovalRequest>> GetPendingByPlaygroundAsync(Guid playgroundId);
    Task<IEnumerable<ApprovalRequest>> GetByRequestedByAsync(Guid requestedById);
    Task UpdateAsync(ApprovalRequest request);
}
