using AutoMapper;
using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Mappings.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services.PlayGround;

public class PlayGroundMemberService : IPlayGroundMemberService
{
    private readonly IPlaygroundMemberRepository _playgroundMemberRepository;
    private readonly IPlaygroundRepository _playGroundMemberRepository;
    private readonly IMapper _mapper;

    public PlayGroundMemberService(
        IPlaygroundMemberRepository playgroundMemberRepository, 
        IPlaygroundRepository playGroundMemberRepository, 
        IMapper mapper)
    {
        _playgroundMemberRepository = playgroundMemberRepository;
        _playGroundMemberRepository = playGroundMemberRepository;
        _mapper = mapper;
    }

    // Creates a new playground member through controller request, used for guest members
    public async Task<PlaygroundMemberResponse?> CreateAsync(Guid playgroundId, CreatePlaygroundMemberRequest request)
    {
       var newMember = await _playgroundMemberRepository
                            .CreateAsync(PlayGroundMemberMapping
                            .ToPlaygroundMember(request));

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(newMember);
    }


    // Used only internally through PlaygroundService, directly creates a owner member on playground creation
    public async Task<PlaygroundMember> CreateOwnerMembershipAsync(Guid playgroundId, Guid personId, bool isAdmin, PlaygroundRole role)
    {
        var memberMap = PlayGroundMemberMapping
                        .ToPlaygroundOwnerMember(playgroundId, personId, isAdmin, role);

        var newMember = await _playgroundMemberRepository
                             .CreateAsync(memberMap) ?? 
                             throw new PersistenceException("Failed to create owner membership");

        return newMember;
    }

    public async Task<PlaygroundMemberResponse?> GetByIdAsync(Guid playgroundId, Guid memberId, Guid currentUserId)
    {
        PlaygroundMember? member = await _playgroundMemberRepository
                                        .GetByIdAsync(playgroundId, memberId);

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(member);
    }

    public Task<IEnumerable<PlaygroundMemberResponse?>> GetAllByPlaygroundAsync(Guid playgroundId, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<PlaygroundMemberResponse?>> DeleteAsync(Guid playgroundId, IEnumerable<Guid> memberIds, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<PlaygroundMemberResponse?>> UpdateAsync(Guid playgroundId, Guid memberId, IEnumerable<CreatePlaygroundMemberRequest> requests, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public Task<PlaygroundMemberResponse?> CreateAsync(Guid playgroundId, Guid currentUserId, CreatePlaygroundMemberRequest request)
    {
        throw new NotImplementedException();
    }
}
