using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Interfaces.Users;
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
    private readonly IPlaygroundAuthorizationService _authorizationService;
    private readonly ICurrentUserService _currentUser;
    private readonly IPersonService _personService;
    private readonly IAuthService _authService;

    public PlayGroundMemberService(
        IPlaygroundMemberRepository playgroundMemberRepository, 
        IAuthService authService,
        IPersonService personService,
        IPlaygroundAuthorizationService authorizationService,
        ICurrentUserService currentUser)
    {
        _playgroundMemberRepository = playgroundMemberRepository;
        _authorizationService = authorizationService;
        _authService = authService;
        _personService = personService;
        _currentUser = currentUser;
    }

    // Creates a new playground member through controller request, used for guest members
    /**
     * Creates a new playground member.
     *
     * @param playgroundId The ID of the playground to which the member will be added.
     * @param request The request object containing the details of the member to be created.
     * @returns A response object containing the details of the created member, or null if creation failed.
     * @throws PersistenceException If there is an error while creating the person or playground member.
     * @throws NotFoundException If the person associated with the user ID is not found.
     * @throws ConflictException If the user is already a member of the playground.
     */
    public async Task<PlaygroundMemberResponse?> CreateAsync(Guid playgroundId, CreatePlaygroundMemberRequest request)
    {
        Guid currentUserId = _currentUser.UserId;

        // Checks if the current user can invite users
        await _authorizationService.EnsureCanInviteUsersAsync(playgroundId, currentUserId);


        // Creates the Person
        Person createdPerson = await _personService.CreateGuestAsync(request.Name, request.Age) ?? 
                                     throw new PersistenceException("Failed to create person");

        // Creates the PlaygroundMember link with the Playground
        PlaygroundMember PlaygroundMember = PlayGroundMemberMapping.ToPlaygroundMember(
                                            playgroundId, 
                                            createdPerson.Id, 
                                            false, // IsAdmin is false for guests
                                            PlaygroundRole.Viewer);// Set manually to Viewer, as guests are always viewers

        PlaygroundMember createdMember = await _playgroundMemberRepository.CreateAsync(PlaygroundMember) ?? 
                                         throw new PersistenceException("Failed to create playground member");


        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(createdMember);
    }



    // Used only internally through PlaygroundService, directly creates a owner member on playground creation
    /**
     * Creates an owner membership for a playground.
     *
     * @param playgroundId The ID of the playground for which the owner membership is being created.
     * @param personId The ID of the person who will be the owner of the playground.
     * @returns The created PlaygroundMember object representing the owner membership.
     * @throws PersistenceException If there is an error while creating the owner membership.
     */
    public async Task<PlaygroundMember> CreateOwnerMembershipAsync(Guid playgroundId, Guid personId)
    {
        // Mapping
        PlaygroundMember ownerMembership = PlayGroundMemberMapping.ToPlaygroundOwnerMember(
            playgroundId,
            personId,
            true, // IsAdmin is true for owners
            PlaygroundRole.Owner); // Set manually to Owner, as this is the owner membership

        PlaygroundMember createdMember = await _playgroundMemberRepository.CreateAsync(ownerMembership) ?? 
                                         throw new PersistenceException("Failed to create owner membership");

        return createdMember;
    }



    /**
     * Retrieves a playground member by their ID.
     *
     * @param playgroundId The ID of the playground to which the member belongs.
     * @param memberId The ID of the member to retrieve.
     * @returns A response object containing the details of the retrieved member, or null if not found.
     * @throws NotFoundException If the member with the specified ID is not found in the playground.
     */
    public async Task<PlaygroundMemberResponse?> GetByIdAsync(Guid playgroundId, Guid memberId)
    {
        Guid currentUserId = _currentUser.UserId;

        // Checks if the current user can view the playground
        await _authorizationService.EnsureCanViewPlaygroundAsync(playgroundId,currentUserId);

        var member = await _playgroundMemberRepository.GetByIdAsync(playgroundId, memberId) ??
                     throw new NotFoundException($"Playground member with ID {memberId} not found in playground {playgroundId}");

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(member);
    }



    /**
     * Deletes a playground member by their ID.
     *
     * @param playgroundId The ID of the playground from which the member will be deleted.
     * @param memberId The ID of the member to delete.
     * @returns A response object containing the details of the deleted member, or null if deletion failed.
     * @throws NotFoundException If the member with the specified ID is not found in the playground.
     * @throws PersistenceException If there is an error while deleting the playground member.
     */
    public async Task<PlaygroundMemberResponse?> DeleteAsync(Guid playgroundId, Guid memberId)
    {
        Guid currentUserId = _currentUser.UserId;

        await _authorizationService.EnsureCanInviteUsersAsync(playgroundId, currentUserId);

        var removed = await _playgroundMemberRepository.DeleteAsync(playgroundId, memberId);

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(removed);
    }



    /**
     * Retrieves all members of a playground.
     *
     * @param playgroundId The ID of the playground for which to retrieve members.
     * @returns A collection of response objects containing the details of all members in the playground.
     * @throws NotFoundException If the playground with the specified ID is not found.
     */
    public async Task<IEnumerable<PlaygroundMemberResponse?>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        Guid currentUserId = _currentUser.UserId;

        await _authorizationService.EnsureCanViewPlaygroundAsync(playgroundId, currentUserId);

        var members = await _playgroundMemberRepository.GetAllByPlaygroundAsync(playgroundId);

        return members.Select(PlayGroundMemberMapping.ToPlaygroundMemberResponse);
    }



    /**
     * Updates a playground member's role and admin status.
     *
     * @param playgroundId The ID of the playground to which the member belongs.
     * @param memberId The ID of the member to update.
     * @param request The request object containing the updated role and admin status for the member.
     * @returns A response object containing the details of the updated member, or null if update failed.
     * @throws NotFoundException If the member with the specified ID is not found in the playground.
     * @throws PersistenceException If there is an error while updating the playground member.
     */
    public async Task<PlaygroundMemberResponse?> UpdateAsync(Guid playgroundId, Guid memberId, UpdatePlaygroundMemberRequest request)
    {
        Guid currentUserId = _currentUser.UserId;

        await _authorizationService.EnsureCanInviteUsersAsync(playgroundId, currentUserId);

        // Get the member to update
        PlaygroundMember member = await _playgroundMemberRepository.GetByIdAsync(playgroundId, memberId) ?? 
                                  throw new NotFoundException("Member not found");

        // Update the member's properties
        member.Role = request.Role;
        member.IsAdmin = request.IsAdmin;

        var updatedMember = await _playgroundMemberRepository.UpdateAsync(member) ??
                             throw new PersistenceException("Failed to update playground member");

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(updatedMember);
    }



    /**
     * Invites a user to join a playground by their email address.
     *
     * @param playgroundId The ID of the playground to which the user will be invited.
     * @param request The request object containing the email address of the user to invite and their role.
     * @returns A response object containing the details of the invited member.
     * @throws NotFoundException If the user or person associated with the email is not found.
     * @throws ConflictException If the user is already a member of the playground.
     * @throws PersistenceException If there is an error while creating the playground member.
     */
    public async Task<PlaygroundMemberResponse> InviteUserAsync(Guid playgroundId, InviteUserRequest request)
    {
        Guid currentUserId = _currentUser.UserId;

        await _authorizationService.EnsureCanInviteUsersAsync(playgroundId, currentUserId);

        // Finds the user by email, if not found throws NotFoundException
        var user = await _authService.FindByEmailAsync(request.Email) ?? 
                         throw new NotFoundException("User not found.");

        // Uses the user ID to find the corresponding person, if not found throws NotFoundException
        var person = await _personService.GetByUserIdAsync(user.Id) 
                           ?? throw new NotFoundException("Person not found.");

        if (await _playgroundMemberRepository.ExistsAsync(playgroundId, person.Id))
        {
            throw new ConflictException("User is already a member.");
        }

        PlaygroundMember newMember = PlayGroundMemberMapping.ToPlaygroundMember(
            playgroundId,
            person.Id,
            false, // IsAdmin is false for invited users
            request.Role);

        var created = await _playgroundMemberRepository.CreateAsync(newMember) ?? 
                            throw new PersistenceException("Failed to invite user.");

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(created);
    }
}
