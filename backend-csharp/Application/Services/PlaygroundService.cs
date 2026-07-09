using AutoMapper;
using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services;

public class PlaygroundService : IPlaygroundService
{
    private readonly IPlaygroundRepository _playgroundRepo;
    private readonly IPlaygroundMemberRepository _memberRepo;
    private readonly IMapper _mapper;

    public PlaygroundService(IPlaygroundRepository playgroundRepo,
                             IPlaygroundMemberRepository memberRepo,
                             IMapper mapper)
    {
        _playgroundRepo = playgroundRepo;
        _memberRepo = memberRepo;
        _mapper = mapper;
    }

    public async Task<PlaygroundResponse> CreateAsync(CreatePlaygroundRequest request, Guid ownerId)
    {
        var playground = new Playground
        {
            Name = request.Name,
            OwnerId = ownerId,
            AskForApproval = request.AskForApproval
        };

        await _playgroundRepo.AddAsync(playground);

        // Adds membership from the owner to the playground as admin
        var ownerMember = new PlaygroundMember
        {
            PlaygroundId = playground.Id,
            //PersonId = /* Pending: should link the Person of the owner */,
            IsAdmin = true
        };

        await _memberRepo.AddAsync(ownerMember);

        return _mapper.Map<PlaygroundResponse>(playground);
    }

    public Task<IEnumerable<PlaygroundResponse>> GetByUserAsync(Guid userId)
    {
        throw new NotImplementedException();
    }

    public Task ToggleAskForApprovalAsync(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }
}
