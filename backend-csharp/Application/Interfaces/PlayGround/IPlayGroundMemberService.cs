using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;

namespace backend_csharp.Application.Interfaces.PlayGround;

public interface IPlayGroundMemberService
{

    Task<PlaygroundMemberResponse?> CreateAsync(Guid playgroundId, CreatePlaygroundMemberRequest request);
    Task<PlaygroundMemberResponse?> GetByIdAsync(Guid playgroundId, Guid memberId);
    Task<PlaygroundMemberResponse?> UpdateAsync(Guid playgroundId, Guid memberId, UpdatePlaygroundMemberRequest requests);
    Task<PlaygroundMemberResponse?> DeleteAsync(Guid playgroundId, Guid memberId);
    Task<IEnumerable<PlaygroundMemberResponse?>> GetAllByPlaygroundAsync(Guid playgroundId);
    Task<PlaygroundMemberResponse?> InviteUserAsync(Guid playgroundId, InviteUserRequest request);

}
