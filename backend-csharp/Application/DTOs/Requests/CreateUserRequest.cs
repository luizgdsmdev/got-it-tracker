namespace backend_csharp.Application.DTOs.Requests;

public record CreateUserRequest(
    string Name,
    int Age,
    string Email,
    string Password
);
