using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context) => _context = context;


    public async Task AddAsync(Transaction transaction)
    => await _context.Transactions.AddAsync(transaction);

    public async Task<Transaction?> GetByIdAsync(Guid id)
    => await _context.Transactions.FindAsync(id);

    public async Task<IEnumerable<Transaction>> GetByPersonIdAsync(Guid personId)
    => await _context.Transactions.Where(t => t.PersonId == personId).ToListAsync();

    public async Task<IEnumerable<Transaction>> GetByPlaygroundIdAsync(Guid playgroundId)
    => await _context.Transactions.Where(t => t.PlaygroundId == playgroundId).ToListAsync();
}
