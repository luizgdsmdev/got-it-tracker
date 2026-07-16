using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record CreatePlaygroundRequest(Guid OwnerId, string Name, bool AskForApproval);