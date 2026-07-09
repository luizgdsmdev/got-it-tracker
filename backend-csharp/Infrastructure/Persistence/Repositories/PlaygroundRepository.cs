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

    public async Task<Playground?> GetByIdAsync(Guid id)
        => await _context.Playgrounds
            .Include(p => p.Members)
            .Include(p => p.Transactions)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<IEnumerable<Playground>> GetByOwnerIdAsync(Guid ownerId)
        => await _context.Playgrounds.Where(p => p.OwnerId == ownerId).ToListAsync();

    public async Task AddAsync(Playground playground)
    {
        await _context.Playgrounds.AddAsync(playground);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Playground playground)
    {
        _context.Playgrounds.Update(playground);
        await _context.SaveChangesAsync();
    }
}
