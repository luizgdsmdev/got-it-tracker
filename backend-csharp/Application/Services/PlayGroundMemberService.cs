using AutoMapper;
using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Application.Mappings;
using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services;

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

    public async Task<PlaygroundMemberResponse?> CreateAsync(Guid playgroundId, Guid currentUserId, CreatePlaygroundMemberRequest request)
    {
       var newMember = await _playgroundMemberRepository
                            .CreateAsync(PlayGroundMemberMapping
                            .ToPlaygroundMember(request));

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(newMember);
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
}
