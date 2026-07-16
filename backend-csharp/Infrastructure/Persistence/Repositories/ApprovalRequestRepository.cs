using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Enums;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class ApprovalRequestRepository : IApprovalRequestRepository
{
    private readonly ApplicationDbContext _context;

    public ApprovalRequestRepository(ApplicationDbContext context) => _context = context;

    public async Task AddAsync(ApprovalRequest request)
    => await _context.ApprovalRequests.AddAsync(request);

    public async Task<ApprovalRequest?> GetByIdAsync(Guid id)
    => await _context.ApprovalRequests.FindAsync(id);

    public async Task<IEnumerable<ApprovalRequest>> GetByRequestedByAsync(Guid requestedById)
    => await _context.ApprovalRequests.Where(r => r.RequestedById == requestedById).ToListAsync();

    public async Task<IEnumerable<ApprovalRequest>> GetPendingByPlaygroundAsync(Guid playgroundId)
    => await _context.ApprovalRequests.Where(r => r.PlaygroundId == playgroundId && r.Status == ApprovalStatus.Pending).ToListAsync();

    public async Task UpdateAsync(ApprovalRequest request)
    {
        _context.ApprovalRequests.Update(request);
        await _context.SaveChangesAsync();
    }
}
