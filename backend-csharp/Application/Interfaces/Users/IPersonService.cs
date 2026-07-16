using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Users;

namespace backend_csharp.Application.Interfaces.Users;

public interface IPersonService
{
    Task<PersonResponse?> CreateAsync(CreatePersonRequest request, Guid playgroundId, Guid currentUserId);
    Task<PersonResponse?> GetByIdAsync(Guid personId, Guid currentUserId);
    Task<PersonResponse?> UpdateAsync(Guid personId, CreatePersonRequest request, Guid currentUserId);
    Task<PersonResponse?> DeleteAsync(Guid personId, Guid currentUserId);           
    Task<IEnumerable<PersonResponse>> GetAllByPlaygroundAsync(Guid playgroundId, Guid currentUserId);
}