namespace backend_csharp.Application.DTOs.Responses.PlayGround;

public record PlaygroundMemberResponse(Guid MembershipId, Guid PlayGroundId, Guid MemberId, bool IsAdmin);
