using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Domain.Entities;
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


    public async Task<Playground> AddAsync(Playground playground)
    {
        await _context.Playgrounds.AddAsync(playground);
        await _context.SaveChangesAsync();
        return playground;
    }

    public async Task<Playground?> GetByIdAsync(Guid id)
        => await _context.Playgrounds.FindAsync(id);

    public async Task<IEnumerable<Playground>> GetByOwnerIdAsync(Guid ownerId)
    {
        return await _context.Playgrounds
        .Include(p => p.Members)
        .Include(p => p.Transactions)
        .Where(p => p.OwnerId == ownerId)
        .ToListAsync();
    }

    public async Task<Playground?> ToggleAskForApprovalAsync(Guid playgroundId)
    {
        Playground? playground = await _context.Playgrounds.FindAsync(playgroundId);
        if (playground == null) return null;

        playground.AskForApproval = !playground.AskForApproval;

        _context.Playgrounds.Update(playground);
        await _context.SaveChangesAsync();

        return playground;

    }

    public async Task<Playground?> UpdateAsync(Guid playgroundId, Playground request)
    {
        Playground? playground = await _context.Playgrounds.FindAsync(playgroundId);

        if (playground == null)
            return null;

        playground.Name = request.Name;
        playground.AskForApproval = request.AskForApproval;
        playground.OwnerId = request.OwnerId;

        await _context.SaveChangesAsync();

        return playground;
    }

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
