namespace backend_csharp.Application.DTOs.Responses.PlayGround;

public record PlaygroundResponse(
    Guid PlayGroundId,
    Guid OwnerId, 
    string Description,
    string Name, 
    bool AskForApproval,
    DateTime CreatedAt
);
