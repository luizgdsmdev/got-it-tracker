using backend_csharp.Domain.Entities.Users;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly ApplicationDbContext _context;

    public PersonRepository(ApplicationDbContext context) => _context = context;

    public async Task<Person?> CreateAsync(Person person)
    {
        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return person;
    }

    public async Task<Person?> GetByIdAsync(Guid id)
    {
        return await _context.People.FindAsync(id);
    }

    public async Task<Person?> GetByUserIdAsync(Guid userId)
    {
        return await _context.People.FirstOrDefaultAsync(p => p.UserId == userId);
    }

    public async Task<Person?> UpdateAsync(Guid personId, string name, int age)
    {
        var existingPerson = await GetByIdAsync(personId);
        if (existingPerson == null) return null;

        // Update the properties of the existing person with the new values
        existingPerson.Name = name;
        existingPerson.Age = age;

        await _context.SaveChangesAsync();
        return existingPerson;
    }

    public async Task<Person?> DeleteAsync(Guid id)
    {
        Person? person = await GetByIdAsync(id);
        if (person == null) return null;

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
        return person;
    }

    public async Task<IEnumerable<Person?>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        return await _context.People
            .Include(p => p.PlaygroundMemberships)
            .Where(p => p.PlaygroundMemberships.Any(pm => pm.PlaygroundId == playgroundId))
            .ToListAsync();
    }

 
    public Task<Person?> GetByPlaygroundAndUserAsync(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }
}
