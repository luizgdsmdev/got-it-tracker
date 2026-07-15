namespace backend_csharp.Application.DTOs.Requests;

public record CreatePlaygroundMemberRequest(Guid playGroundId, Guid currentUserId, bool isAdmin);
