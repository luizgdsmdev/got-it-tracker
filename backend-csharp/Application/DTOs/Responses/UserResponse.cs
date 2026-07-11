namespace backend_csharp.Application.DTOs.Responses;

public record UserResponse(
    Guid Id,
    string Name,
    int Age,
    string Email
);
