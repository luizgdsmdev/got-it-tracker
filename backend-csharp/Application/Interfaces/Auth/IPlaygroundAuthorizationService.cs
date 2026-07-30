
using backend_csharp.Domain.Entities.PlayGround;

/**
 * Interface for the Playground Authorization Service.
 */
namespace backend_csharp.Application.Interfaces.Auth;

public interface IPlaygroundAuthorizationService
{
    Task<PlaygroundMember> EnsureCanViewPlaygroundAsync(Guid playgroundId, Guid userId);

    Task<PlaygroundMember> EnsureCanCreateTransactionAsync(Guid playgroundId, Guid userId);

    Task<PlaygroundMember> EnsureCanApproveTransactionAsync(Guid playgroundId, Guid userId);

    Task<PlaygroundMember> EnsureCanInviteUsersAsync(Guid playgroundId, Guid userId);

    Task<PlaygroundMember> EnsureCanManagePlaygroundAsync(Guid playgroundId, Guid userId);
}
