using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Responses.PlayGround;

public record PlaygroundMemberResponse(
    Guid PlayGroundId, 
    Guid? PersonId, 
    bool IsAdmin,
    DateTime JoinedAt,
    PlaygroundRole Role
    );
