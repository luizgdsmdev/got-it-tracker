using backend_csharp.Domain.Entities.Users;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class PersonRepository : IPersonRepository
{
    private readonly ApplicationDbContext _context;

    public PersonRepository(ApplicationDbContext context) => _context = context;


    /**
     * Creates a new person in the database.
     *
     * @param person The person entity to be created.
     * @return The created person entity with its generated ID.
     */
    public async Task<Person?> CreateAsync(Person person)
    {
        _context.People.Add(person);
        await _context.SaveChangesAsync();

        return person;
    }


    /**
     * Retrieves a person from the database by their unique identifier.
     *
     * @param id The unique identifier of the person to retrieve.
     * @return The person entity if found; otherwise, null.
     */
    public async Task<Person?> GetByIdAsync(Guid id)
    {
        return await _context.People
        .AsNoTracking()
        .SingleOrDefaultAsync(p => p.Id == id);
    }


    /**
     * Retrieves a person from the database by their associated user ID.
     *
     * @param userId The unique identifier of the user associated with the person.
     * @return The person entity if found; otherwise, null.
     */
    public async Task<Person?> GetByUserIdAsync(Guid userId)
    {
        return await _context.People.AsNoTracking().FirstOrDefaultAsync(p => p.UserId == userId);
    }



    /**
     * Updates a person in the database.
     *
     * @param personId The unique identifier of the person to update.
     * @param name The new name for the person.
     * @param age The new age for the person.
     * @return The updated person entity if found; otherwise, null.
     */
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


    /**
     * Deletes a person from the database by their unique identifier.
     *
     * @param id The unique identifier of the person to delete.
     * @return The deleted person entity if found; otherwise, null.
     */
    public async Task<Person?> DeleteAsync(Guid id)
    {
        Person? person = await GetByIdAsync(id);
        if (person == null) return null;

        _context.People.Remove(person);
        await _context.SaveChangesAsync();
        return person;
    }


    /**
     * Retrieves all persons associated with a specific playground.
     *
     * @param playgroundId The unique identifier of the playground.
     * @return A collection of person entities associated with the specified playground.
     */
    public async Task<IEnumerable<Person?>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        return await _context.People
            .AsNoTracking()
            .Include(p => p.PlaygroundMemberships)
            .Where(p => p.PlaygroundMemberships.Any(pm => pm.PlaygroundId == playgroundId))
            .ToListAsync();
    }



    /**
     * Retrieves a person associated with a specific playground and user.
     *
     * @param playgroundId The unique identifier of the playground.
     * @param userId The unique identifier of the user.
     * @return The person entity if found; otherwise, null.
     */
    public Task<Person?> GetByPlaygroundAndUserAsync(Guid playgroundId, Guid userId)
    {
        throw new NotImplementedException();
    }
}
