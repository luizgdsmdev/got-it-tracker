using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class PlaygroundMemberRepository : IPlaygroundMemberRepository
{
    private readonly ApplicationDbContext _context;
    private readonly ITransactionRepository _transactionRepository;

    public PlaygroundMemberRepository(ApplicationDbContext context, ITransactionRepository transactionRepository)
    {
        _context = context;
        _transactionRepository = transactionRepository;
    }


    /**
     * Creates a new playground member in the database.
     *
     * @param member The playground member entity to be created.
     * @return The created playground member entity with its generated ID.
     */
    public async Task<PlaygroundMember?> CreateAsync(PlaygroundMember member)
    {
         _context.PlaygroundMembers.Add(member);

    await _context.SaveChangesAsync();

    // Reloading the user for tracking
    return await _context.PlaygroundMembers
        .AsNoTracking()
        .Include(pm => pm.Person)
        .FirstOrDefaultAsync(pm =>
            pm.PlaygroundId == member.PlaygroundId &&
            pm.PersonId == member.PersonId);
    }


    /**
     * Retrieves a playground member from the database by their unique identifier.
     *
     * @param playgroundId The unique identifier of the playground to which the member belongs.
     * @param id The unique identifier of the playground member to retrieve.
     * @return The playground member entity if found; otherwise, null.
     */
    public Task<PlaygroundMember?> GetByIdAsync(Guid playgroundId, Guid id)
    {
        return _context.PlaygroundMembers
        .AsNoTracking()
        .Include(pm => pm.Person)
        .FirstOrDefaultAsync(m =>
            m.PlaygroundId == playgroundId &&
            m.PersonId == id);
    }


    /**
     * Retrieves all playground members associated with a specific playground.
     *
     * @param playgroundId The unique identifier of the playground.
     * @return A collection of playground member entities associated with the specified playground.
     */
    public async Task<IEnumerable<PlaygroundMember>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        return await _context.PlaygroundMembers
        .AsNoTracking()
        .Include(pm => pm.Person)
        .Where(pm => pm.PlaygroundId == playgroundId)
        .ToListAsync();
    }



    /**
     * Retrieves all playground members associated with a specific person.
     *
     * @param personId The unique identifier of the person.
     * @return A collection of playground member entities associated with the specified person.
     */
    public async Task<IEnumerable<PlaygroundMember>> GetAllByPersonIdAsync(Guid personId)
    {
        return await _context.PlaygroundMembers
                    .AsNoTracking()
                    .Where(pm => pm.PersonId == personId)
                    .ToListAsync();
    }

    /**
     * Deletes a playground member from the database by their unique identifier.
     *
     * @param playgroundId The unique identifier of the playground to which the member belongs.
     * @param memberId The unique identifier of the playground member to delete.
     * @return The deleted playground member entity if found; otherwise, throws a NotFoundException.
     * @throws NotFoundException If the specified playground member is not found in the database.
     */
    public async Task<PlaygroundMember> DeleteAsync(Guid playgroundId, Guid memberId)
    {
        PlaygroundMember member = await GetByIdAsync(playgroundId, memberId) ?? 
                                  throw new NotFoundException("Member not found");

        await _transactionRepository.DeleteByMemberAsync(playgroundId, member.PersonId);


        _context.PlaygroundMembers.Remove(member);

        await _context.SaveChangesAsync();


        return member;
    }



    /**
     * Updates an existing playground member in the database.
     *
     * @param member The playground member entity to be updated.
     * @return The updated playground member entity.
     */
    public async Task<PlaygroundMember> UpdateAsync(PlaygroundMember member)
    {
        _context.PlaygroundMembers.Update(member);

        await _context.SaveChangesAsync();

        return member;
    }



    /**
     * Retrieves a playground member for authorization purposes based on the playground ID and user ID.
     *
     * @param playgroundId The unique identifier of the playground.
     * @param userId The unique identifier of the user.
     * @return The playground member entity if found; otherwise, null.
     */
    public async Task<PlaygroundMember?> GetMembershipForAuthorizationAsync(Guid playgroundId, Guid personId)
    {
        return await _context.PlaygroundMembers
            .AsNoTracking()
            .Include(pm => pm.Playground)
            .FirstOrDefaultAsync(pm =>
                pm.PlaygroundId == playgroundId &&
                pm.PersonId == personId);
    }


    /**
     * Checks if a playground member exists in the database based on the playground ID and person ID.
     *
     * @param playgroundId The unique identifier of the playground.
     * @param personId The unique identifier of the person.
     * @return True if the playground member exists; otherwise, false.
     */
    public async Task<bool> ExistsAsync(Guid playgroundId, Guid personId)
    {
        return await _context.PlaygroundMembers
                    .AsNoTracking()
                    .AnyAsync(pm =>
                    pm.PlaygroundId == playgroundId &&
                    pm.PersonId == personId);
    }
}
