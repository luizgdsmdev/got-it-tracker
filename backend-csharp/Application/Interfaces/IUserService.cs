using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.Interfaces;

public interface IUserService
{
    Task<UserResponse> CreateAsync(CreateUserRequest request);
    Task<UserResponse?> GetByIdAsync(Guid id);
    Task<UserResponse?> GetByEmailAsync(string email);
    Task<UserResponse?> UpdateByIdAsync(Guid id, CreateUserRequest userRequest);
    Task<UserResponse?> DeleteByIdAsync(Guid id);

    // TODO: insert user login method and bussines logic
}
