using backend_csharp.Domain.Entities;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IPersonRepository
{
    Task<Person?> GetByIdAsync(Guid id);
    Task<IEnumerable<Person>> GetByPlaygroundIdAsync(Guid playgroundId);
    Task AddAsync(Person person);
    Task DeleteAsync(Guid id);                    
}
