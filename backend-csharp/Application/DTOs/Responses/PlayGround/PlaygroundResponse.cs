namespace backend_csharp.Application.DTOs.Responses.PlayGround;

public record PlaygroundResponse(
    Guid playGroundId,
    Guid OwnerId, 
    string Name, 
    bool AskForApproval,
    DateTime CreatedAt
);
