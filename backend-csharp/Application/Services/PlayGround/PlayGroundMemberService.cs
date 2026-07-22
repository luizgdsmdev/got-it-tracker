using AutoMapper;
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
using backend_csharp.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace backend_csharp.Application.Services.PlayGround;

public class PlayGroundMemberService : IPlayGroundMemberService
{
    private readonly IPlaygroundMemberRepository _playgroundMemberRepository;
    private readonly IPlaygroundRepository _playGroundRepository;
    private readonly IPlaygroundAuthorizationService _authorizationService;
    private readonly ICurrentUserService _currentUser;
    private readonly IPersonService _personService;
    private readonly IMapper _mapper;

    public PlayGroundMemberService(
        IPlaygroundMemberRepository playgroundMemberRepository, 
        IPlaygroundRepository playGroundRepository,
        IPersonService personService,
        IPlaygroundAuthorizationService authorizationService,
        ICurrentUserService currentUser,
        IMapper mapper)
    {
        _playgroundMemberRepository = playgroundMemberRepository;
        _playGroundRepository = playGroundRepository;
        _authorizationService = authorizationService;
        _personService = personService;
        _currentUser = currentUser;
        _mapper = mapper;
    }

    // Creates a new playground member through controller request, used for guest members
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

    public async Task<PlaygroundMemberResponse?> GetByIdAsync(Guid playgroundId, Guid memberId)
    {
        Guid currentUserId = _currentUser.UserId;

        // Checks if the current user can view the playground
        await _authorizationService.EnsureCanViewPlaygroundAsync(playgroundId,currentUserId);

        var member = await _playgroundMemberRepository.GetByIdAsync(playgroundId, memberId) ??
                     throw new NotFoundException($"Playground member with ID {memberId} not found in playground {playgroundId}");

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(member);
    }

    public async Task<PlaygroundMemberResponse?> DeleteAsync(Guid playgroundId, Guid memberId)
    {
        Guid currentUserId = _currentUser.UserId;

        await _authorizationService.EnsureCanInviteUsersAsync(playgroundId, currentUserId);

        var removed = await _playgroundMemberRepository.DeleteAsync(playgroundId, memberId);

        return PlayGroundMemberMapping.ToPlaygroundMemberResponse(removed);
    }

    public async Task<IEnumerable<PlaygroundMemberResponse?>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        Guid currentUserId = _currentUser.UserId;

        await _authorizationService.EnsureCanViewPlaygroundAsync(playgroundId, currentUserId);

        var members = await _playgroundMemberRepository.GetAllByPlaygroundAsync(playgroundId);

        return members.Select(PlayGroundMemberMapping.ToPlaygroundMemberResponse);
    }

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
}
