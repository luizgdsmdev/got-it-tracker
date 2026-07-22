using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class PlaygroundRepository : IPlaygroundRepository
{
    private readonly ApplicationDbContext _context;

    public PlaygroundRepository(ApplicationDbContext context)
    {
        _context = context;
    }


    /**
     * Adds a new playground to the database.
     *
     * @param playground The playground entity to be added.
     * @return The added playground entity with its generated ID.
     */
    public async Task<Playground> AddAsync(Playground playground)
    {
        await _context.Playgrounds.AddAsync(playground);
        await _context.SaveChangesAsync();
        return playground;
    }


    /**
     * Retrieves a playground from the database by its unique identifier.
     *
     * @param id The unique identifier of the playground to retrieve.
     * @return The playground entity if found; otherwise, null.
     */
    public async Task<Playground?> GetByIdAsync(Guid id)
    {
        return await _context.Playgrounds.FindAsync(id);
    }


    /**
     * Retrieves all playgrounds owned by a specific user from the database.
     *
     * @param ownerId The unique identifier of the owner of the playgrounds to retrieve.
     * @return A collection of playground entities owned by the specified user.
     */
    public async Task<IEnumerable<Playground?>> GetByOwnerIdAsync(Guid ownerId)
    {
        return await _context.Playgrounds
        .Include(p => p.Members)
        .Include(p => p.Transactions)
        .Where(p => p.OwnerId == ownerId)
        .ToListAsync();
    }


    /**
     * Toggles the AskForApproval property of a playground in the database.
     *
     * @param playgroundId The unique identifier of the playground to update.
     * @return The updated playground entity if found; otherwise, null.
     */
    public async Task<Playground?> ToggleAskForApprovalAsync(Guid playgroundId)
    {
        Playground? playground = await _context.Playgrounds.FindAsync(playgroundId);
        if (playground == null) return null;

        playground.AskForApproval = !playground.AskForApproval;

        _context.Playgrounds.Update(playground);
        await _context.SaveChangesAsync();

        return playground;

    }


    /**
     * Updates a playground in the database.
     *
     * @param playgroundId The unique identifier of the playground to update.
     * @param request The playground entity containing the updated information.
     * @return The updated playground entity if found; otherwise, null.
     */
    public async Task<Playground?> UpdateAsync(Guid playgroundId, Playground request)
    {
        Playground? playground = await _context.Playgrounds.FindAsync(playgroundId);

        if (playground == null)
            return null;

        playground.OwnerId = request.OwnerId;
        playground.Name = request.Name;
        playground.Description = request.Description;
        playground.AskForApproval = request.AskForApproval;

        await _context.SaveChangesAsync();

        return playground;
    }


    /**
     * Deletes a playground from the database by its unique identifier.
     *
     * @param playgroundId The unique identifier of the playground to delete.
     * @return The deleted playground entity if found; otherwise, null.
     */
    public async Task<Playground?> DeleteAsync(Guid playgroundId)
    {
        Playground? playground = await _context.Playgrounds.FindAsync(playgroundId);

        if (playground == null)
            return null;

        _context.Playgrounds.Remove(playground);
        await _context.SaveChangesAsync();

        return playground;
    }
}
