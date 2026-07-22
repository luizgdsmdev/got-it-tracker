using backend_csharp.Domain.Enums;

namespace backend_csharp.Domain.Extensions;

public static class PlaygroundRoleExtensions
{
    public static bool CanViewPlayground(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager or
            PlaygroundRole.Contributor or
            PlaygroundRole.Viewer;
    }

    public static bool CanCreateTransactions(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager or
            PlaygroundRole.Contributor;
    }

    public static bool CanApproveTransactions(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager;
    }

    public static bool CanInviteUsers(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager;
    }

    public static bool CanManagePlayground(this PlaygroundRole role)
    {
        return role == PlaygroundRole.Owner;
    }
}
