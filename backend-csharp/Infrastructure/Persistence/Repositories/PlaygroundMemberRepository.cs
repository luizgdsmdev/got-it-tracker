using backend_csharp.Domain.Entities;
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

    public async Task<PlaygroundMember?> GetByPlaygroundAndPersonAsync(Guid playgroundId, Guid personId)
    {
        PlaygroundMember? playgroundMember = await _context.PlaygroundMembers
                .FirstOrDefaultAsync(m => m.PlaygroundId == playgroundId && m.PersonId == personId);

        if (playgroundMember == null) return null;

        return playgroundMember;
    }

    public async Task AddAsync(PlaygroundMember member)
    {
        await _context.PlaygroundMembers.AddAsync(member);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(Guid id)
    {
        var member = await _context.PlaygroundMembers.FindAsync(id);
        if (member != null)
        {
            _context.PlaygroundMembers.Remove(member);
            await _context.SaveChangesAsync();
        }
    }

    public Task<PlaygroundMember?> GetByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }
}
