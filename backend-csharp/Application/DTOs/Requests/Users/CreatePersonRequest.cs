namespace backend_csharp.Application.DTOs.Requests.Users;

public record CreatePersonRequest(string Name, int Age, Guid PlaygroundId, Guid CurrentUserId);
