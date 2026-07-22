using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class PlaygroundMemberRepository : IPlaygroundMemberRepository
{
    private readonly ApplicationDbContext _context;

    public PlaygroundMemberRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PlaygroundMember?> CreateAsync(PlaygroundMember member)
    {
        _context.PlaygroundMembers.Add(member);
        await _context.SaveChangesAsync();
        return member;
    }
    public Task<PlaygroundMember?> GetByIdAsync(Guid playgroundId, Guid id)
    {
        return _context.PlaygroundMembers
            .AsNoTracking()
            .FirstOrDefaultAsync(m => m.PlaygroundId == playgroundId && m.PersonId == id);
    }
    
    
    public async Task<IEnumerable<PlaygroundMember>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        return await _context.PlaygroundMembers
            .Where(pm => pm.PlaygroundId == playgroundId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<PlaygroundMember> DeleteAsync(Guid playgroundId, Guid memberId)
    {
        PlaygroundMember member = await GetByIdAsync(playgroundId, memberId) ??
                           throw new NotFoundException("Member not found");

        _context.PlaygroundMembers.Remove(member);

        await _context.SaveChangesAsync();

        return member;
    }

    public async Task<PlaygroundMember> UpdateAsync(PlaygroundMember members)
    {
        _context.PlaygroundMembers.UpdateRange(members);

        await _context.SaveChangesAsync();

        return members;
    }

    public async Task<PlaygroundMember?> GetMembershipForAuthorizationAsync(Guid playgroundId, Guid userId)
    {
        return await _context.PlaygroundMembers
            .AsNoTracking()
            .Include(pm => pm.Playground)
            .Include(pm => pm.Person)
            .FirstOrDefaultAsync(pm =>
                pm.PlaygroundId == playgroundId &&
                pm.Person.UserId == userId);
    }
}
