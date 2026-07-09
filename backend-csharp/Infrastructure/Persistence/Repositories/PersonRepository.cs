using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly ApplicationDbContext _context;

    public PersonRepository(ApplicationDbContext context) => _context = context;

    public async Task<Person?> GetByIdAsync(Guid id)
        => await _context.People.FindAsync(id);

    public async Task<IEnumerable<Person>> GetByPlaygroundIdAsync(Guid playgroundId)
        => await _context.PlaygroundMembers
            .Where(m => m.PlaygroundId == playgroundId)
            .Select(m => m.Person)
            .ToListAsync();

    public async Task AddAsync(Person person)
    {
        await _context.People.AddAsync(person);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var person = await _context.People.FindAsync(id);
        if (person != null)
        {
            _context.People.Remove(person);
            await _context.SaveChangesAsync();
        }
    }
}
