using backend_csharp.Domain.Enums;

namespace backend_csharp.Domain.Extensions;


/**
 * Extension methods for the PlaygroundRole enum.
 */
public static class PlaygroundRoleExtensions
{
    /**
     * Determines if the specified role can view the playground.
     *
     * @param role The PlaygroundRole to check.
     * @return True if the role can view the playground; otherwise, false.
     */
    public static bool CanViewPlayground(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager or
            PlaygroundRole.Contributor or
            PlaygroundRole.Viewer;
    }


    /**
     * Determines if the specified role can create transactions in the playground.
     *
     * @param role The PlaygroundRole to check.
     * @return True if the role can create transactions; otherwise, false.
     */
    public static bool CanCreateTransactions(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager or
            PlaygroundRole.Contributor;
    }


    /**
     * Determines if the specified role can approve transactions in the playground.
     *
     * @param role The PlaygroundRole to check.
     * @return True if the role can approve transactions; otherwise, false.
     */
    public static bool CanApproveTransactions(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager;
    }


    /**
     * Determines if the specified role can invite users to the playground.
     *
     * @param role The PlaygroundRole to check.
     * @return True if the role can invite users; otherwise, false.
     */
    public static bool CanInviteUsers(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager;
    }


    /**
     * Determines if the specified role can manage the playground.
     *
     * @param role The PlaygroundRole to check.
     * @return True if the role can manage the playground; otherwise, false.
     */
    public static bool CanManagePlayground(this PlaygroundRole role)
    {
        return role == PlaygroundRole.Owner;
    }


    /**
     * Determines if the specified role can auto-approve transactions in the playground.
     *
     * @param role The PlaygroundRole to check.
     * @return True if the role can auto-approve transactions; otherwise, false.
     */
    public static bool CanAutoApproveTransactions(this PlaygroundRole role)
    {
        return role is
            PlaygroundRole.Owner or
            PlaygroundRole.Manager;
    }


}
