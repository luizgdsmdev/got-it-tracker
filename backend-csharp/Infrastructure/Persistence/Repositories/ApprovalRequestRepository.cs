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


    /**
     * Adds a new approval request to the database.
     *
     * @param request The approval request entity to be added.
     * @return A task representing the asynchronous operation.
     */
    public async Task<ApprovalRequest?> CreateAsync(ApprovalRequest request)
    {
        await _context.ApprovalRequests.AddAsync(request);

        await _context.SaveChangesAsync();

        return request;

    }


    /**
     * Retrieves an approval request from the database by its unique identifier.
     *
     * @param id The unique identifier of the approval request to retrieve.
     * @return The approval request entity if found; otherwise, null.
     */
    public async Task<ApprovalRequest?> GetByIdAsync(Guid id)
    => await _context.ApprovalRequests.FindAsync(id);


    /**
     * Retrieves all approval requests from the database.
     *
     * @return A collection of all approval request entities.
     */
    public async Task<IEnumerable<ApprovalRequest>> GetByRequestedByAsync(Guid requestedById)
    => await _context.ApprovalRequests.Where(r => r.RequestedById == requestedById).ToListAsync();


    /**
     * Retrieves all pending approval requests for a specific playground from the database.
     *
     * @param playgroundId The unique identifier of the playground to filter approval requests.
     * @return A collection of pending approval request entities for the specified playground.
     */
    public async Task<IEnumerable<ApprovalRequest>> GetPendingByPlaygroundAsync(Guid playgroundId)
    {
        return await _context.ApprovalRequests
            .Where(r => r.PlaygroundId == playgroundId && 
                   r.Status == ApprovalStatus.Pending)
            .ToListAsync();
    }

    /**
     * Updates an existing approval request in the database.
     *
     * @param request The approval request entity to be updated.
     * @return A task representing the asynchronous operation.
     */
    public async Task<ApprovalRequest?> UpdateAsync(ApprovalRequest request)
    {
        _context.ApprovalRequests.Update(request);
        await _context.SaveChangesAsync();

        return request;
    }
}
