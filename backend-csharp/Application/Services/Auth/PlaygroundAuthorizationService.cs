using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Domain.Extensions;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services.Auth;

public class PlaygroundAuthorizationService : IPlaygroundAuthorizationService
{
    private readonly IPlaygroundMemberRepository _memberRepository;

    public PlaygroundAuthorizationService(
        IPlaygroundMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }


    /**
     * Retrieves the membership of a user in a playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @returns The PlaygroundMember object representing the user's membership.
     * @throws UnauthorizedException If the user is not a member of the playground.
     */
    private async Task<PlaygroundMember> GetMembershipAsync(Guid playgroundId, Guid userId)
    {
        return await _memberRepository.GetMembershipForAuthorizationAsync(playgroundId, userId) ??
                     throw new UnauthorizedException("You are not a member of this playground.");
    }


    /**
     * Ensures that a user has permission to view a playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @throws UnauthorizedException If the user does not have permission to view the playground.
     */
    public async Task EnsureCanViewPlaygroundAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanViewPlayground()) throw new UnauthorizedException("You don't have permission to view this playground.");
    }


    /**
     * Ensures that a user has permission to create a transaction in a playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @throws UnauthorizedException If the user does not have permission to create transactions.
     */
    public async Task EnsureCanCreateTransactionAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanCreateTransactions()) throw new UnauthorizedException("You don't have permission to create transactions.");
    }


    /**
     * Ensures that a user has permission to approve a transaction in a playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @throws UnauthorizedException If the user does not have permission to approve transactions.
     */
    public async Task EnsureCanApproveTransactionAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanApproveTransactions()) throw new UnauthorizedException("You don't have permission to approve transactions.");
    }


    /**
     * Ensures that a user has permission to invite users to a playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @throws UnauthorizedException If the user does not have permission to invite users.
     */
    public async Task EnsureCanInviteUsersAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanInviteUsers()) throw new UnauthorizedException("You don't have permission to invite users.");
    }


    /**
     * Ensures that a user has permission to manage a playground.
     *
     * @param playgroundId The ID of the playground.
     * @param userId The ID of the user.
     * @throws UnauthorizedException If the user does not have permission to manage the playground.
     */
    public async Task EnsureCanManagePlaygroundAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanManagePlayground()) throw new UnauthorizedException("Only the playground owner can perform this action.");
    }
}