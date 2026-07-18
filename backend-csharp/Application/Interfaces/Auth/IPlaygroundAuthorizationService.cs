namespace backend_csharp.Application.Interfaces.Auth;

public interface IPlaygroundAuthorizationService
{
    Task EnsureCanViewPlayground(Guid playgroundId, Guid userId);

    Task EnsureCanCreateTransaction(Guid playgroundId, Guid userId);

    Task EnsureCanApproveTransaction(Guid playgroundId, Guid userId);

    Task EnsureCanInviteUsers(Guid playgroundId, Guid userId);

    Task EnsureCanManagePlayground(Guid playgroundId, Guid userId);
}
