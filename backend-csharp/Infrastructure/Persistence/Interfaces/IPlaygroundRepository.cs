using backend_csharp.Domain.Entities;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPlaygroundRepository
{
    Task<Playground> AddAsync(Playground playground);
    Task<Playground?> GetByIdAsync(Guid id);
    Task<IEnumerable<Playground>> GetByOwnerIdAsync(Guid ownerId);
    Task<Playground?> ToggleAskForApprovalAsync(Guid playgroundId);
    Task<Playground?> UpdateAsync(Guid playgroundId, Playground request);
    Task<Playground?> DeleteAsync(Guid playgroundId);
}
