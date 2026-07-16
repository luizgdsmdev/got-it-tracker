namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record CreatePlaygroundMemberRequest(Guid playGroundId, Guid currentUserId, bool isAdmin);
