namespace backend_csharp.Application.DTOs.Responses.Users;

public record UserResponse(
    Guid Id,
    string Name,
    int Age,
    string Email
);
