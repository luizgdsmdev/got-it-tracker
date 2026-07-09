using backend_csharp.Domain.Entities;

namespace backend_csharp.Infrastructure.Persistence.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}
