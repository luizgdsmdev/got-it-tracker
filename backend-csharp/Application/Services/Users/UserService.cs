using AutoMapper;
using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Application.Mappings.Users;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.Services.Users;


/**
 * UserService class implements the IUserService interface and provides methods for managing users.
 * Holds a reference to an IUserRepository and an IMapper for data access and mapping between entities and DTOs.
 * Also includes methods for creating, retrieving, updating, and deleting users asynchronously.
 * Includes bussines logic for user management, such as hashing passwords and mapping between request and response DTOs.
 */
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }


    /**
     * Creates a new user asynchronously based on the provided CreateUserRequest.
     * Maps the request DTO to a User entity, adds it to the repository, and returns a UserResponse DTO.
     * @param request The CreateUserRequest containing user details.
     * @returns A UserResponse DTO representing the created user.
     */
    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {

        //TODO: Hash (BCrypt)
        User user = UserMapping.ToUser(request);

        //Guard clause to check if a user with the same email already exists in the repository
        //Avoids propagating duplicate users and ensures email uniqueness
        if (await GetByEmailAsync(request.Email) != null) throw new ConflictException("This email was already registered, check your email address.");

        //Check user age, if less than 12 throw exception
        if (request.Age < 12) throw new InvalidOperationException("Users must be at least 12 years old.");






        await _userRepository.AddAsync(user);

        return UserMapping.ToDtoResponse(user);
    }

    public async Task<UserResponse?> GetByIdAsync(Guid id)
    {
        User? user = await _userRepository.GetByIdAsync(id);
        if (user is null) return null;

        return UserMapping.ToDtoResponse(user);
    }

    public async Task<UserResponse?> GetByEmailAsync(string email)
    {

        User? user = await _userRepository.GetByEmailAsync(email);
        if (user is null) return null;

        return UserMapping.ToDtoResponse(user);
    }

    public async Task<UserResponse?> UpdateByIdAsync(Guid id, CreateUserRequest userRequest)
    {
        if(userRequest == null) return null;

        User? user = await _userRepository.UpdateByIdAsync(id, UserMapping.ToUser(userRequest));
        return user == null ? null : UserMapping.ToDtoResponse(user);
    }

    public async Task<UserResponse?> DeleteByIdAsync(Guid id)
    {
        User? userDeleted = await _userRepository.DeleteByIdAsync(id);

        return userDeleted == null ? null : UserMapping.ToDtoResponse(userDeleted);

    }

   

}

