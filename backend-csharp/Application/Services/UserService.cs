using AutoMapper;
using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Application.Mappings;
using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UserService(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }

    public async Task<UserResponse> CreateAsync(CreateUserRequest request)
    {

        //TODO: Hash (BCrypt)
        User user = UserMapping.ToUser(request);

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

