using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _context;

    public TransactionRepository(ApplicationDbContext context) => _context = context;


    /**
     * Creates a new transaction in the database.
     *
     * @param transaction The transaction entity to be added.
     * @return A task representing the asynchronous operation.
     */
    public async Task<Transaction?> CreateAsync(Transaction transaction)
    {
        var newTransaction = await _context.Transactions.AddAsync(transaction);
        await _context.SaveChangesAsync();

        return newTransaction.Entity;
    }



    public async Task<Transaction?> UpdateAsync(Transaction transaction)
    {
        var existingTransaction = await _context.Transactions.FindAsync(transaction.Id)
        ?? throw new NotFoundException($"Transaction with ID {transaction.Id} not found.");

        _context.Entry(existingTransaction)
                .CurrentValues
                .SetValues(transaction);

        await _context.SaveChangesAsync();

        return existingTransaction;
    }


    /**
     * Retrieves a transaction from the database by its unique identifier.
     *
     * @param id The unique identifier of the transaction to retrieve.
     * @return The transaction entity if found; otherwise, null.
     */
    public async Task<Transaction?> GetByIdAsync(Guid playgroundId, Guid transactionId)
    {
        return await _context.Transactions
              .AsNoTracking()
              .FirstOrDefaultAsync(t =>
                t.PlaygroundId == playgroundId &&
                t.Id == transactionId);
    }


    /**
     * Retrieves all transactions associated with a specific person from the database.
     *
     * @param personId The unique identifier of the person to filter transactions.
     * @return A collection of transaction entities associated with the specified person.
     */
    public async Task<IEnumerable<Transaction>> GetByPersonIdAsync(Guid personId)
    =>  await _context.Transactions
            .AsNoTracking()
            .Where(t => t.PersonId == personId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();



    /**
     * Retrieves all transactions associated with a specific playground from the database.
     *
     * @param playgroundId The unique identifier of the playground to filter transactions.
     * @return A collection of transaction entities associated with the specified playground.
     */
    public async Task<IEnumerable<Transaction>> GetByPlaygroundIdAsync(Guid playgroundId)
    => await _context.Transactions
                    .AsNoTracking()
                    .Where(t => t.PlaygroundId == playgroundId).ToListAsync();


    /**
     * Deletes a transaction from the database by its unique identifier.
     *
     * @param playgroundId The unique identifier of the playground to filter transactions.
     * @param transactionId The unique identifier of the transaction to delete.
     * @return The deleted transaction entity.
     */
    public async Task<Transaction> DeleteByIdAsync(Guid playgroundId, Guid transactionId)
    {
        var transaction = await GetByIdAsync(playgroundId, transactionId) ?? 
                          throw new NotFoundException($"Transaction with ID {transactionId} not found.");

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();

        return transaction;
    }



    public async Task DeleteByMemberAsync(Guid playgroundId, Guid personId)
    {
        var transactions = await _context.Transactions
        .Where(t =>
            t.PlaygroundId == playgroundId &&
            t.PersonId == personId)
        .ToListAsync();


        if (!transactions.Any())
            return;


        _context.Transactions.RemoveRange(transactions);

        await _context.SaveChangesAsync();
    }
}
