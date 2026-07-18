using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using backend_csharp.Infrastructure.Persistence.Repositories;

namespace backend_csharp.Application.Services.Auth;

public class PlaygroundAuthorizationService : IPlaygroundAuthorizationService
{

    private readonly IPersonRepository _PersonRepository;
    public PlaygroundAuthorizationService(IPersonRepository personRepository) =>_PersonRepository = personRepository;



    private async Task<PlaygroundMember> GetMember(
        Guid playgroundId,
        Guid userId)
    {
        //var member = await _PersonRepository
        //    .GetByPlaygroundAndUserAsync(playgroundId, userId);

        //if (member == null)
        //    throw new UnauthorizedException("You are not a member of this playground.");

        //return member;
        throw new NotImplementedException();
    }



    public Task EnsureCanApproveTransaction(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task EnsureCanCreateTransaction(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task EnsureCanInviteUsers(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task EnsureCanManagePlayground(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task EnsureCanViewPlayground(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }
}
