namespace backend_csharp.Application.DTOs.Responses;

public record PlaygroundMemberResponse(Guid membershipId, Guid playGroundId, Guid memberId, bool isAdmin);
