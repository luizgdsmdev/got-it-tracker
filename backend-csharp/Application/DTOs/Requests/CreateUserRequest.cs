namespace backend_csharp.Application.DTOs.Requests;

public record CreateUserRequest(
    string Name,
    string Email,
    string Password
);
