using AutoMapper;
using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Application.Mappings;
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

    public async Task<PlaygroundResponse?> CreateAsync(CreatePlaygroundRequest request)
    {
        Playground? playGround = await _playgroundRepo
                                .AddAsync(
                                PlayGroundMapping
                                .ToPlayground(request));


        // Adds membership from the owner to the playground as admin
        //var ownerMember = new PlaygroundMember
        //{
        //    PlaygroundId = playground.Id,
        //    //PersonId = /* Pending: should link the Person of the owner */,
        //    IsAdmin = true
        //};

        //await _memberRepo.AddAsync(ownerMember);

        return PlayGroundMapping.ToDtoResponse(playGround);
    }

    public async Task<PlaygroundResponse?> GetByIdAsync(Guid playgroundId)
    {
        if (playgroundId == Guid.Empty) return null;

        Playground? playGround = await _playgroundRepo
                                .GetByIdAsync(playgroundId);

        if (playGround is null)
            throw new InvalidOperationException("Playground not found");

        return PlayGroundMapping.ToDtoResponse(playGround);
    }

    public async Task<IEnumerable<PlaygroundResponse?>> GetByUserAsync(Guid userId)
    {
        if (userId == Guid.Empty) return null;

        var playGround = await _playgroundRepo.GetByOwnerIdAsync(userId);

        if (playGround is null)
            throw new InvalidOperationException("No Playground found");

        return PlayGroundMapping.ToDtoResponseList(playGround);
    }

    public async Task<PlaygroundResponse?> ToggleAskForApprovalAsync(Guid playgroundId)
    {
        if(playgroundId == Guid.Empty)
            throw new ArgumentException("Invalid playground or user ID");

        Playground? playGround = await _playgroundRepo
                                .GetByIdAsync(playgroundId);

        Playground? updatedPlayground = await _playgroundRepo.ToggleAskForApprovalAsync(playgroundId);
        return updatedPlayground != null ? PlayGroundMapping.ToDtoResponse(updatedPlayground) : null;
    }

    public async Task<PlaygroundResponse?> UpdateAsync(Guid playgroundId, CreatePlaygroundRequest request)
    {
        if(playgroundId == Guid.Empty)
            throw new ArgumentException("Invalid playground ID");
        if(request == null)
            throw new ArgumentNullException(nameof(request));

        Playground? playGround = await _playgroundRepo.UpdateAsync(playgroundId, PlayGroundMapping.ToPlayground(request));

        return playGround != null ? PlayGroundMapping.ToDtoResponse(playGround) : null;
    }


    public async Task<PlaygroundResponse?> DeleteAsync(Guid playgroundId)
    {
        if (playgroundId == Guid.Empty)
            throw new ArgumentException("Invalid playground ID");

        Playground? deletedPlayground = await _playgroundRepo.DeleteAsync(playgroundId);

        return deletedPlayground != null ? PlayGroundMapping.ToDtoResponse(deletedPlayground) : null;

    }
}
