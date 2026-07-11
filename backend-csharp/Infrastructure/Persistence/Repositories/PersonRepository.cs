using backend_csharp.Domain.Entities;
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
        if(person == null) throw new ArgumentNullException(nameof(person));
        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return person;
    }

    public async Task<Person?> GetByIdAsync(Guid id)
    {
        if (id == Guid.Empty) throw new ArgumentException("Id cannot be empty", nameof(id));
        return await _context.People.FindAsync(id);
    }

    public async Task<IEnumerable<Person?>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        //return await _context.People.Where(p => p.PlaygroundId == playgroundId).ToListAsync();
        //

        return await _context.People
            .Include(p => p.PlaygroundMemberships)
            .Where(p => p.PlaygroundMemberships.Any(pm => pm.PlaygroundId == playgroundId))
            .ToListAsync();
    }

    public async Task<Person?> UpdateAsync(Guid personId, Person person)
    {
        var existingPerson = await GetByIdAsync(personId);
        if (existingPerson == null) return null;

        // Update the properties of the existing person with the new values
        existingPerson.Name = person.Name;
        existingPerson.Age = person.Age;

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


}
