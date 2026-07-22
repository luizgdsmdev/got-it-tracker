using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using backend_csharp.Domain.Extensions;

namespace backend_csharp.Application.Authorization;

public class PlaygroundAuthorizationService : IPlaygroundAuthorizationService
{
    private readonly IPlaygroundMemberRepository _memberRepository;

    public PlaygroundAuthorizationService(
        IPlaygroundMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }


    /**
     * Retrieves the membership of a user in a specific playground.
     * Throws an UnauthorizedException if the user is not a member of the playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @return The PlaygroundMember object representing the user's membership.
     */
    private async Task<PlaygroundMember> GetMembershipAsync(Guid playgroundId, Guid userId)
    {
        return await _memberRepository
            .GetMembershipForAuthorizationAsync(playgroundId, userId)
            ?? throw new UnauthorizedException("You are not a member of this playground.");
    }


    /**
     * Ensures that a user has permission to view a specific playground.
     * Throws an UnauthorizedException if the user is not a member of the playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     */
    public async Task EnsureCanViewPlaygroundAsync(Guid playgroundId, Guid userId)
    {
        await GetMembershipAsync(playgroundId, userId);
    }


    /**
     * Ensures that a user has permission to create a transaction in a specific playground.
     * Throws an UnauthorizedException if the user does not have the required role.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     */
    public async Task EnsureCanCreateTransactionAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanCreateTransactions())
        {
            throw new UnauthorizedException("You don't have permission to create transactions.");
        }
    }


    /**
     * Ensures that a user has permission to approve a transaction in a specific playground.
     * Throws an UnauthorizedException if the user does not have the required role.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     */
    public async Task EnsureCanApproveTransactionAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanApproveTransactions())
        {
            throw new UnauthorizedException("You don't have permission to approve transactions.");
        }
    }


    /**
     * Ensures that a user has permission to invite other users to a specific playground.
     * Throws an UnauthorizedException if the user does not have the required role.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     */
    public async Task EnsureCanInviteUsersAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanInviteUsers())
        {
            throw new UnauthorizedException("You don't have permission to invite users.");
        }
    }

    /**
     * Ensures that a user has permission to manage a specific playground.
     * Throws an UnauthorizedException if the user does not have the required role.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     */
    public async Task EnsureCanManagePlaygroundAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanManagePlayground())
        {
            throw new UnauthorizedException("Only the owner can manage this playground.");
        }
    }
}
