using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context) => _context = context;


    /**
     * Adds a new transaction to the database.
     *
     * @param transaction The transaction entity to be added.
     * @return A task representing the asynchronous operation.
     */
    public async Task AddAsync(Transaction transaction)
    => await _context.Transactions.AddAsync(transaction);


    /**
     * Retrieves a transaction from the database by its unique identifier.
     *
     * @param id The unique identifier of the transaction to retrieve.
     * @return The transaction entity if found; otherwise, null.
     */
    public async Task<Transaction?> GetByIdAsync(Guid id)
    => await _context.Transactions.FindAsync(id);


    /**
     * Retrieves all transactions associated with a specific person from the database.
     *
     * @param personId The unique identifier of the person to filter transactions.
     * @return A collection of transaction entities associated with the specified person.
     */
    public async Task<IEnumerable<Transaction>> GetByPersonIdAsync(Guid personId)
    => await _context.Transactions.Where(t => t.PersonId == personId).ToListAsync();


    /**
     * Retrieves all transactions associated with a specific playground from the database.
     *
     * @param playgroundId The unique identifier of the playground to filter transactions.
     * @return A collection of transaction entities associated with the specified playground.
     */
    public async Task<IEnumerable<Transaction>> GetByPlaygroundIdAsync(Guid playgroundId)
    => await _context.Transactions.Where(t => t.PlaygroundId == playgroundId).ToListAsync();
}
