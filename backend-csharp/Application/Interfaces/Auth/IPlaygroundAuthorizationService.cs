namespace backend_csharp.Application.Interfaces.Auth;

public interface IPlaygroundAuthorizationService
{
    Task EnsureCanViewPlaygroundAsync(Guid playgroundId, Guid userId);

    Task EnsureCanCreateTransactionAsync(Guid playgroundId, Guid userId);

    Task EnsureCanApproveTransactionAsync(Guid playgroundId, Guid userId);

    Task EnsureCanInviteUsersAsync(Guid playgroundId, Guid userId);

    Task EnsureCanManagePlaygroundAsync(Guid playgroundId, Guid userId);
}
