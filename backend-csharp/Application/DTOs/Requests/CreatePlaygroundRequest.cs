using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.DTOs.Requests;

public record CreatePlaygroundRequest(string Name, bool AskForApproval);