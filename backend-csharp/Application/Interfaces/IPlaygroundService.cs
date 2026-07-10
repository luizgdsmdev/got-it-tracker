using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;

namespace backend_csharp.Application.Interfaces;

public interface IPlaygroundService
{
    Task<PlaygroundResponse?> CreateAsync(CreatePlaygroundRequest request);
    Task<PlaygroundResponse?> GetByIdAsync(Guid playgroundId);
    Task<IEnumerable<PlaygroundResponse?>> GetByUserAsync(Guid userId);
    Task<PlaygroundResponse?> ToggleAskForApprovalAsync(Guid playgroundId);
    Task<PlaygroundResponse?> UpdateAsync(Guid playgroundId, CreatePlaygroundRequest request);
    Task<PlaygroundResponse?> DeleteAsync(Guid playgroundId);
}
