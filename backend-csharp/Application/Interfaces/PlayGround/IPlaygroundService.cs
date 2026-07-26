using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Application.Interfaces.PlayGround;

public interface IPlaygroundService
{
    Task<PlaygroundResponse> CreateAsync(CreatePlaygroundRequest request);
    Task<PlaygroundResponse> GetByIdAsync(Guid playgroundId);
    Task<IEnumerable<PlaygroundResponse>> GetByUserAsync(Guid userId);
    Task<IEnumerable<PlaygroundResponse>> GetByUserAsync();
    Task<PlaygroundResponse> ToggleAskForApprovalAsync(Guid playgroundId);
    Task<PlaygroundResponse> UpdateAsync(Guid playgroundId, CreatePlaygroundRequest request);
    Task<ActionResult> DeleteAsync(Guid playgroundId);
}
