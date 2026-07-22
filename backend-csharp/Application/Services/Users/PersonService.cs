using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Application.Mappings.Users;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services.Users;

/**
 * Service class for managing Person entities.
 * Receives only internal calls, not open to the public or controllers.
 * This service is responsible for handling operations related to Person entities, including creation, retrieval, updating, and deletion.
 * It also provides functionality to retrieve all persons associated with a specific playground.
 */
public class PersonService : IPersonService
{

    private readonly IPersonRepository _personRepository;

    public PersonService(
        IPersonRepository personRepository)
    {
        _personRepository = personRepository;
    }


    /**
     * Creates a new Person entity only for a registered User.
     *
     * @param user The User object containing the user's details.
     * @param currentUserId The ID of the currently authenticated user (from JWT token).
     * @return The newly created Person entity.
     */
    public async Task<Person> CreateForUserAsync(User user)
    {
        // Mapping user to person
        // Using 4 as default = owner of the playground since this method is called only when
        // a new playground is created and the user creating it is the owner
        Person personMapp = PersonMapping.ToUserPerson(user);

        await _personRepository.CreateAsync(personMapp);

        return personMapp;
    }


    /**
     * Creates a new Person entity for a guest user (not registered).
     *
     * @param name The name of the guest user.
     * @param age The age of the guest user.
     * @return The newly created Person entity for the guest user.
     */
    public async Task<Person> CreateGuestAsync(string name, int age)
    {
        // Sets UserId = null on mapping since this is a guest user
        Person personMapp = PersonMapping.ToGuestPerson(name, age);

        await _personRepository.CreateAsync(personMapp);

        return personMapp;
    }


    /**
     * Retrieves a Person entity by its unique identifier.
     *
     * @param personId The unique identifier of the Person entity to retrieve.
     * @return The Person entity if found; otherwise, throws a NotFoundException.
     * @throws NotFoundException if the Person entity with the specified ID does not exist.
     */
    public async Task<Person?> GetPersonByIdAsync(Guid personId)
    {

        Person? person = await _personRepository.GetByIdAsync(personId) ??
                         throw new NotFoundException("Person not found");

        return person;
    }


    /**
     * Retrieves a Person entity by the associated User ID.
     *
     * @param userId The ID of the User entity associated with the Person.
     * @return The Person entity if found; otherwise, throws a NotFoundException.
     * @throws NotFoundException if the Person entity with the specified User ID does not exist.
     */
    public async Task<Person?> GetByUserIdAsync(Guid userId)
    {
        Person? person = await _personRepository.GetByUserIdAsync(userId) ?? 
                         throw new NotFoundException("Person not found");
        return person;
    }


    /**
     * Updates an existing Person entity with new data.
     *
     * @param personId The unique identifier of the Person entity to update.
     * @param name The updated name for the Person entity.
     * @param age The updated age for the Person entity.
     * @return The updated Person entity if successful; otherwise, null if the Person does not exist.
     */
    public async Task<Person?> UpdateAsync(Guid personId, string name, int age)
    {

        Person? person = await _personRepository.UpdateAsync(personId, name, age) ??
                         throw new NotFoundException("Person not found");

        return person;
    }


    /**
     * Deletes a Person entity by its unique identifier.
     *
     * @param personId The unique identifier of the Person entity to delete.
     * @param currentUserId The ID of the currently authenticated user (from JWT token).
     * @return The deleted Person entity if successful; otherwise, null if the Person does not exist.
     */
    public async Task<Person?> DeleteAsync(Guid personId)
    {
        Person? person = await _personRepository.DeleteAsync(personId) ??
                         throw new NotFoundException("Person not found");

        return person;
    }


    /**
     * Retrieves all Person entities associated with a specific Playground.
     *
     * @param playgroundId The unique identifier of the Playground.
     * @return A collection of Person entities associated with the specified Playground.
     * @throws NotFoundException if no Person entities are found for the specified Playground.
     */
    public async Task<IEnumerable<Person>> GetAllByPlaygroundAsync(Guid playgroundId)
    {
        List<Person?> people = [.. await _personRepository.GetAllByPlaygroundAsync(playgroundId)];

        if (people == null || people.Count == 0) throw new NotFoundException("No people found for the specified playground");

        return people!;
    }

}
