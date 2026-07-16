using AutoMapper;
using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Mappings.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services.PlayGround;

public class PlaygroundService : IPlaygroundService
{
    private readonly IPlaygroundRepository _playgroundRepo;
    private readonly IPlaygroundMemberRepository _memberRepo;
    private readonly IPersonRepository _personRepo;
    private readonly IUserRepository _userRepo;
    private readonly IMapper _mapper;

    public PlaygroundService(IPlaygroundRepository playgroundRepo,
                             IPlaygroundMemberRepository memberRepo,
                             IPersonRepository personRepo,
                             IUserRepository userRepo,
                             IMapper mapper)
    {
        _playgroundRepo = playgroundRepo;
        _memberRepo = memberRepo;
        _personRepo = personRepo;
        _userRepo = userRepo;
        _mapper = mapper;

    }

    public async Task<PlaygroundResponse?> CreateAsync(CreatePlaygroundRequest request)
    {
        Playground? playGround = await _playgroundRepo
                                .AddAsync(
                                PlayGroundMapping
                                .ToPlayground(request));


        // Adds membership from the owner to the playground as admin
        if (playGround is not null)
        {
            // Check for the existence of the owner in the database
            User? owner = await _userRepo.GetByIdAsync(playGround.OwnerId);
            if(owner == null)
                throw new InvalidOperationException("Owner not found");



            //await _playgroundRepo.AddAsync(playGround.Id, playGround.OwnerId, true);
        }



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
