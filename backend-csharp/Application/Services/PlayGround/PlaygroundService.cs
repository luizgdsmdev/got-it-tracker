using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Application.Mappings.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Application.Services.PlayGround;

public class PlaygroundService : IPlaygroundService
{
    private readonly IPlaygroundRepository _playgroundRepo;
    private readonly ICurrentUserService _currentUser;
    private readonly IPlaygroundMemberRepository _memberRepo;
    private readonly IPersonRepository _personRepo;
    private readonly IPersonService _personService;
    private readonly IUserRepository _userRepo;

    public PlaygroundService(IPlaygroundRepository playgroundRepo,
                             IPlaygroundMemberRepository memberRepo,
                             ICurrentUserService currentUser,
                             IPersonRepository personRepo,
                             IPersonService personService,
                             IUserRepository userRepo)
    {
        _playgroundRepo = playgroundRepo;
        _currentUser = currentUser;
        _memberRepo = memberRepo;
        _personRepo = personRepo;
        _personService = personService;
        _userRepo = userRepo;

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

        // Person creation logic
        // Current user service to get the current user id (reover from the JWT token)
        Guid currentUserId = _currentUser.UserId;


        // Create a new playground
        Playground playgroundMap = PlayGroundMapping.ToPlayground(request, currentUserId);

        Playground newPlayground = await _playgroundRepo.AddAsync(playgroundMap) ??
                                   throw new PersistenceException("Failed to create playground");


        // Get the current user from the repository
        User? currentUser = await _userRepo.GetByIdAsync(currentUserId) ??
                            throw new NotFoundException("Current user not found");

        // Use the user info to create the person if it doesn't exist
        Person? person = await _personRepo.GetByUserIdAsync(currentUserId);
        if (person == null)
        {
            // Create a new person
            person = await _personService.CreateForUserAsync(currentUser) ??
                                       throw new PersistenceException("Failed to create person");
        }

        // Add the person created or retrieved to the playground members
        var membership = await _memberRepo.CreateAsync(
                         PlayGroundMemberMapping
                         .ToPlaygroundOwnerMember(
                             newPlayground.Id, 
                             person.Id, 
                             true, // isAdmin
                             PlaygroundRole.Owner)) ??
                             throw new PersistenceException("Failed to add owner as a member of the playground");


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

        // Person creation logic
        // Current user service to get the current user id (reover from the JWT token)
        Guid currentUserId = _currentUser.UserId;


        // Calls the update function, sends the playGround after mapping
        Playground requestPlayground = PlayGroundMapping.ToPlayground(request, currentUserId);
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
