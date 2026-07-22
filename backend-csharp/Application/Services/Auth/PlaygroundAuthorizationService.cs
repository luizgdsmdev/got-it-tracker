using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Domain.Extensions;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using backend_csharp.Infrastructure.Persistence.Repositories;

namespace backend_csharp.Application.Services.Auth;

public class PlaygroundAuthorizationService : IPlaygroundAuthorizationService
{
    private readonly IPlaygroundMemberRepository _memberRepository;

    public PlaygroundAuthorizationService(
        IPlaygroundMemberRepository memberRepository)
    {
        _memberRepository = memberRepository;
    }

    private async Task<PlaygroundMember> GetMembershipAsync(Guid playgroundId, Guid userId)
    {
        return await _memberRepository.GetMembershipForAuthorizationAsync(playgroundId, userId) ??
                     throw new UnauthorizedException("You are not a member of this playground.");
    }

    public async Task EnsureCanViewPlaygroundAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanViewPlayground()) throw new UnauthorizedException("You don't have permission to view this playground.");
    }

    public async Task EnsureCanCreateTransactionAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanCreateTransactions()) throw new UnauthorizedException("You don't have permission to create transactions.");
    }

    public async Task EnsureCanApproveTransactionAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanApproveTransactions()) throw new UnauthorizedException("You don't have permission to approve transactions.");
    }

    public async Task EnsureCanInviteUsersAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanInviteUsers()) throw new UnauthorizedException("You don't have permission to invite users.");
    }

    public async Task EnsureCanManagePlaygroundAsync(Guid playgroundId, Guid userId)
    {
        var member = await GetMembershipAsync(playgroundId, userId);

        if (!member.Role.CanManagePlayground()) throw new UnauthorizedException("Only the playground owner can perform this action.");
    }
}