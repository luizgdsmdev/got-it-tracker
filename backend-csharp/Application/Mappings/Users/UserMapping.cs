using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Auth;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Domain.Entities.Users;

namespace backend_csharp.Application.Mappings.Users;

public class UserMapping
{

    /**
     * Maps a request to create a new User to the corresponding entity.
     * @param request The request containing the user data.
     * @returns A new instance of User.
     */
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


    /**
     * Maps a User entity to a response DTO.
     * @param user The User entity to be mapped.
     * @returns A new instance of UserResponse.
     */
    public static UserResponse ToDtoResponse(User user)
    {
        return new UserResponse(user.Id, user.Name!, user.Age, user.Email!);
    }


    /**
     * Maps a User entity to a LoginResponse DTO, including access and refresh tokens.
     * @param user The User entity to be mapped.
     * @param accessToken The access token for the user.
     * @param refreshToken The refresh token for the user.
     * @param expiresAt The expiration time of the access token.
     * @returns A new instance of LoginResponse containing the mapped data and tokens.
     */
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
