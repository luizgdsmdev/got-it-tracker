using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Responses.PlayGround;

public record PlaygroundMemberResponse(
    // Membership info
    Guid PlayGroundId, 
    Guid? PersonId, 
    bool IsAdmin,
    DateTime JoinedAt,
    PlaygroundRole Role,

    // Person info
    Guid? UserId,
    string Name,
    int Age
    );
