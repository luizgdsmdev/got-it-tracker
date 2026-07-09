using backend_csharp.Domain.Entities;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction?> GetByIdAsync(Guid id);
    Task<IEnumerable<Transaction>> GetByPlaygroundIdAsync(Guid playgroundId);
    Task<IEnumerable<Transaction>> GetByPersonIdAsync(Guid personId);
    Task AddAsync(Transaction transaction);
}
