using backend_csharp.Domain.Entities.PlayGround;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPlaygroundMemberRepository
{
    Task<PlaygroundMember?> CreateAsync(PlaygroundMember member);
    Task<PlaygroundMember?> GetByIdAsync(Guid playgroundId, Guid id);
    Task<IEnumerable<PlaygroundMember?>> UpdateAsync(IEnumerable<PlaygroundMember> members);
    Task<IEnumerable<PlaygroundMember?>> DeleteAsync(Guid playgroundId, IEnumerable<Guid> ids);
    Task<IEnumerable<PlaygroundMember?>> GetAllByPlaygroundAsync(Guid playgroundId);
}

