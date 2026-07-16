using AutoMapper;
using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Mappings.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.AspNetCore.Mvc;

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


    /**
     * Creates a new playground based on the provided request.
     *
     * @param request The request containing the details of the playground to be created.
     * @return A task that represents the asynchronous operation. The task result contains the response with the created playground details.
     * @throws ArgumentNullException If the request is null.
     * @throws PersistenceException If there is an error while persisting the playground to the database.
     */
    public async Task<PlaygroundResponse> CreateAsync(CreatePlaygroundRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        Playground playground = PlayGroundMapping.ToPlayground(request);

        Playground newPlayground = await _playgroundRepo.AddAsync(playground) ??
                                   throw new PersistenceException("Failed to create playground");


        //TODO: Add the owner as a member of the playground with admin role

        return PlayGroundMapping.ToDtoResponse(newPlayground);
    }

    /**
     * Retrieves a playground by its ID.
     *
     * @param playgroundId The ID of the playground to retrieve.
     * @return A task that represents the asynchronous operation. The task result contains the response with the playground details.
     * @throws ArgumentException If the playground ID is invalid or null.
     * @throws NotFoundException If the playground with the specified ID is not found.
     */
    public async Task<PlaygroundResponse> GetByIdAsync(Guid playgroundId)
    {
        if (playgroundId == Guid.Empty) throw new ArgumentException("Invalid or null playground ID");

        Playground? playGround = await _playgroundRepo.GetByIdAsync(playgroundId) ??
                                 throw new NotFoundException($"Playground with ID {playgroundId} not found");


        return PlayGroundMapping.ToDtoResponse(playGround);
    }

    /**
     * Retrieves all playgrounds associated with a specific user.
     *
     * @param userId The ID of the user whose playgrounds are to be retrieved.
     * @return A task that represents the asynchronous operation. The task result contains a collection of responses with the playground details.
     * @throws ArgumentException If the user ID is invalid or null.
     * @throws NotFoundException If no playgrounds are found for the specified user.
     */
    public async Task<IEnumerable<PlaygroundResponse>> GetByUserAsync(Guid userId)
    {
        if (userId == Guid.Empty) throw new ArgumentException("Invalid or null user ID");

        var playGround = await _playgroundRepo.GetByOwnerIdAsync(userId) ??
                         throw new NotFoundException("No playground found for the specified owner");

        return PlayGroundMapping.ToDtoResponseList(playGround!);
    }

    /**
     * Toggles the "Ask for Approval" status of a playground.
     *
     * @param playgroundId The ID of the playground whose approval status is to be toggled.
     * @return A task that represents the asynchronous operation. The task result contains the response with the updated playground details.
     * @throws ArgumentException If the playground ID is invalid or null.
     * @throws NotFoundException If the playground with the specified ID is not found.
     */
    public async Task<PlaygroundResponse> ToggleAskForApprovalAsync(Guid playgroundId)
    {
        if (playgroundId == Guid.Empty) throw new ArgumentException("Invalid playground ID");

        // Validates for existence of the playground before toggling the approval status
        Playground updatedPlayground = await _playgroundRepo.ToggleAskForApprovalAsync(playgroundId) ??
                                       throw new NotFoundException("No playground found for the specified ID");


        return PlayGroundMapping.ToDtoResponse(updatedPlayground);
    }


    /**
     * Updates the details of a playground.
     *
     * @param playgroundId The ID of the playground to be updated.
     * @param request The request containing the updated details of the playground.
     * @return A task that represents the asynchronous operation. The task result contains the response with the updated playground details.
     * @throws ArgumentException If the playground ID is invalid or null.
     * @throws ArgumentNullException If the request is null.
     * @throws NotFoundException If the playground with the specified ID is not found.
     */
    public async Task<PlaygroundResponse> UpdateAsync(Guid playgroundId, CreatePlaygroundRequest request)
    {
        if (playgroundId == Guid.Empty) throw new ArgumentException("Invalid playground ID");
        ArgumentNullException.ThrowIfNull(request);

        // Calls the update function, sends the playGround after mapping
        Playground requestPlayground = PlayGroundMapping.ToPlayground(request);
        Playground playGround = await _playgroundRepo.UpdateAsync(
                                 playgroundId,
                                 requestPlayground) ??
                                 throw new NotFoundException("No playground found for the specified ID");

        return PlayGroundMapping.ToDtoResponse(playGround);
    }

    /**
     * Deletes a playground by its ID.
     *
     * @param playgroundId The ID of the playground to be deleted.
     * @return A task that represents the asynchronous operation. The task result contains an ActionResult indicating the success of the deletion.
     * @throws ArgumentException If the playground ID is invalid or null.
     * @throws NotFoundException If the playground with the specified ID is not found.
     */
    public async Task<ActionResult> DeleteAsync(Guid playgroundId)
    {
        if (playgroundId == Guid.Empty) throw new ArgumentException("Invalid playground ID");

        _ = await _playgroundRepo.DeleteAsync(playgroundId) ??
                                        throw new NotFoundException("No playground found for the specified ID");

        return new OkObjectResult($"Playground with ID {playgroundId} deleted successfully");

    }
}
