using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;

namespace backend_csharp.Application.Interfaces.PlayGround;

public interface IPlayGroundMemberService
{

    Task<PlaygroundMemberResponse?> CreateAsync(Guid playgroundId, Guid currentUserId, CreatePlaygroundMemberRequest request);
    Task<PlaygroundMemberResponse?> GetByIdAsync(Guid playgroundId, Guid memberId, Guid currentUserId);
    Task<IEnumerable<PlaygroundMemberResponse?>> UpdateAsync(Guid playgroundId, Guid memberId, IEnumerable<CreatePlaygroundMemberRequest> requests, Guid currentUserId);
    Task<IEnumerable<PlaygroundMemberResponse?>> DeleteAsync(Guid playgroundId, IEnumerable<Guid> memberIds, Guid currentUserId);
    Task<IEnumerable<PlaygroundMemberResponse?>> GetAllByPlaygroundAsync(Guid playgroundId, Guid currentUserId);

}
