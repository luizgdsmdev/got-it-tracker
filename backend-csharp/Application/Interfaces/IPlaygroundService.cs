using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;

namespace backend_csharp.Application.Interfaces;

public interface IPlaygroundService
{
    Task<PlaygroundResponse> CreateAsync(CreatePlaygroundRequest request, Guid ownerId);
    Task<IEnumerable<PlaygroundResponse>> GetByUserAsync(Guid userId);
    Task ToggleAskForApprovalAsync(Guid playgroundId, Guid userId);
}
