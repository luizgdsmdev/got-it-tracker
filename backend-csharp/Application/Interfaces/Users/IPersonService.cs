using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Domain.Entities.Users;

namespace backend_csharp.Application.Interfaces.Users;

public interface IPersonService
{
    Task<Person> CreateForUserAsync(User user);
    Task<Person> CreateGuestAsync(string name, int age);
    Task<Person?> GetPersonByIdAsync(Guid personId);
    Task<Person?> GetByUserIdAsync(Guid userId);
    Task<Person?> UpdateAsync(Guid personId, string name, int aget);
    Task<Person?> DeleteAsync(Guid personId);
    Task<IEnumerable<Person>> GetAllByPlaygroundAsync(Guid playgroundId);
}