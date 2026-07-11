namespace backend_csharp.Application.DTOs.Requests;

public record CreatePlaygroundMemberRequest(Guid playGroundId, Guid currentUserId, Guid memberID, bool isAdmin);
