using backend_csharp.Domain.Entities.Transactions;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface ITransactionRepository
{
    Task<Transaction?> CreateAsync(Transaction transaction);
    Task<Transaction?> UpdateAsync(Transaction transaction);
    Task<Transaction?> GetByIdAsync(Guid playgroundId, Guid transactionId);
    Task<IEnumerable<Transaction>> GetByPlaygroundIdAsync(Guid playgroundId);
    Task<IEnumerable<Transaction>> GetByPersonIdAsync(Guid personId);
    Task<Transaction> DeleteByIdAsync(Guid playgroundId, Guid transactionId);
}
