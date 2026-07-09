using backend_csharp.Domain.Entities;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPlaygroundMemberRepository
{
    Task<PlaygroundMember?> GetByIdAsync(Guid id);
    Task<PlaygroundMember?> GetByPlaygroundAndPersonAsync(Guid playgroundId, Guid personId);
    Task AddAsync(PlaygroundMember member);
    Task RemoveAsync(Guid id);
}

