using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Domain.Entities;

namespace backend_csharp.Application.Mappings;

public class UserMapping
{
    public static User ToUser(CreateUserRequest request)
    {
        //Basic validation for now
        if (request is null)
            throw new ArgumentNullException(nameof(request), "Request cannot be null");
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(request.Email))
            throw new ArgumentException("Email is required");
        if (string.IsNullOrWhiteSpace(request.Password))
            throw new ArgumentException("Password is required");

        return new User
        {
            Name = request.Name,
            Email = request.Email,
            Password = request.Password //TODO: Hash (BCrypt)
        };
    }

    public static UserResponse ToDtoResponse(User user)
    {
        //Basic validation for now
        if (user is null)
            throw new ArgumentNullException(nameof(user), "User cannot be null");
        if (string.IsNullOrWhiteSpace(user.Name))
            throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(user.Email))
            throw new ArgumentException("Email is required");
        if (string.IsNullOrWhiteSpace(user.Password))
            throw new ArgumentException("Password is required");

        return new UserResponse(user.Id, user.Name, user.Email);
    }
}
