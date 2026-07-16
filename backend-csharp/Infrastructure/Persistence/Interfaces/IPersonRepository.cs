using backend_csharp.Domain.Entities.Users;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPersonRepository
{
    Task<Person?> CreateAsync(Person person);
    Task<Person?> GetByIdAsync(Guid id);
    Task<Person?> UpdateAsync(Guid personId, Person person);
    Task<Person?> DeleteAsync(Guid id);                    
    Task<IEnumerable<Person?>> GetAllByPlaygroundAsync(Guid playgroundId);
}
