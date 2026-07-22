using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Auth;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Domain.Entities.Users;

namespace backend_csharp.Application.Mappings.Users;

public class UserMapping
{
    public static User ToUser(UpdateUserRequest request)
    {

        return new User
        {
            Name = request.Name,
            UserName = request.Email,
            Age = request.Age,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow
        };
    }

    public static UserResponse ToDtoResponse(User user)
    {

        return new UserResponse(user.Id, user.Name!, user.Age, user.Email!);
    }

    public static LoginResponse ToLoginResponse(User user, string accessToken, string refreshToken, DateTime expiresAt)
    {

        return new LoginResponse(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            ExpiresAt: expiresAt,
            User: ToDtoResponse(user)
        );

    }
}
