using backend_csharp.Domain.Entities;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPlaygroundRepository
{
    Task<Playground?> GetByIdAsync(Guid id);
    Task<IEnumerable<Playground>> GetByOwnerIdAsync(Guid ownerId);
    Task AddAsync(Playground playground);
    Task UpdateAsync(Playground playground);
}
