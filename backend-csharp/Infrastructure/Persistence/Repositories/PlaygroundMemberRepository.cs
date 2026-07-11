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

    public Task<PlaygroundMember> CreateAsync(PlaygroundMember member)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<PlaygroundMember>> DeleteAsync(Guid playgroundId, IEnumerable<Guid> ids)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<PlaygroundMember>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        throw new NotImplementedException();
    }

    public Task<PlaygroundMember> GetByIdAsync(Guid playgroundId, Guid id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<PlaygroundMember>> UpdateAsync(IEnumerable<PlaygroundMember> members)
    {
        throw new NotImplementedException();
    }
}
