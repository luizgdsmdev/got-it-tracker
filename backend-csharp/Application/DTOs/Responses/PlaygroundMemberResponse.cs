namespace backend_csharp.Application.DTOs.Responses;

public record PlaygroundMemberResponse(Guid MembershipId, Guid PlayGroundId, Guid MemberId, bool IsAdmin);
