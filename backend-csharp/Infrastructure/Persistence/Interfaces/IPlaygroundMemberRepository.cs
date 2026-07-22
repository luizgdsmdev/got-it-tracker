using backend_csharp.Domain.Entities.PlayGround;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPlaygroundMemberRepository
{
    Task<PlaygroundMember?> CreateAsync(PlaygroundMember member);
    Task<PlaygroundMember?> GetByIdAsync(Guid playgroundId, Guid id);
    Task<PlaygroundMember> UpdateAsync(PlaygroundMember member);
    Task<PlaygroundMember> DeleteAsync(Guid playgroundId, Guid id);
    Task<IEnumerable<PlaygroundMember>> GetAllByPlaygroundAsync(Guid playgroundId);
    Task<PlaygroundMember?> GetMembershipForAuthorizationAsync(Guid playgroundId, Guid userId);
    Task<bool> ExistsAsync(Guid playgroundId, Guid personId);
}

