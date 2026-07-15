namespace backend_csharp.Application.DTOs.Responses.Auth;

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserResponse User
);
