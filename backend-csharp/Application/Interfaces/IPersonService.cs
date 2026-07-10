using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;

namespace backend_csharp.Application.Interfaces;

public interface IPersonService
{
    Task<PersonResponse?> CreateAsync(CreatePersonRequest request, Guid playgroundId, Guid currentUserId);
    Task<PersonResponse?> GetByIdAsync(Guid personId, Guid currentUserId);
    Task<PersonResponse?> UpdateAsync(Guid personId, CreatePersonRequest request, Guid currentUserId);
    Task<PersonResponse?> DeleteAsync(Guid personId, Guid currentUserId);           
    Task<IEnumerable<PersonResponse>> GetAllByPlaygroundAsync(Guid playgroundId, Guid currentUserId);
}