using backend_csharp.Domain.Entities.Users;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }


    /**
     * Adds a new user to the database.
     *
     * @param user The user entity to be added.
     * @return A task representing the asynchronous operation.
     */
    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }


    /**
     * Retrieves a user from the database by their unique identifier.
     *
     * @param id The unique identifier of the user to retrieve.
     * @return The user entity if found; otherwise, null.
     */
    public async Task<User?> GetByIdAsync(Guid id)
        => await _context.Users.FindAsync(id);


    /**
     * Retrieves a user from the database by their email address.
     *
     * @param email The email address of the user to retrieve.
     * @return The user entity if found; otherwise, null.
     */
    public async Task<User?> GetByEmailAsync(string email)
        => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);


    /**
     * Updates a user in the database by their unique identifier.
     *
     * @param id The unique identifier of the user to update.
     * @param user The updated user entity.
     * @return The updated user entity if found and updated; otherwise, null.
     */
    public async Task<User?> UpdateByIdAsync(Guid id, User user)
    {
        if (user == null) return null;

        User? userDb = await _context.Users.FindAsync(id);
        if (userDb is null) return null;

        // Update the user properties
        userDb.UserName = user.UserName;
        userDb.Email = user.Email;
        userDb.Age = user.Age;

        await _context.SaveChangesAsync();
        return userDb;
    }


    /**
     * Deletes a user from the database by their unique identifier.
     *
     * @param id The unique identifier of the user to delete.
     * @return The deleted user entity if found and deleted; otherwise, null.
     */
    public async Task<User?> DeleteByIdAsync(Guid id)
    {
        User? user = await _context.Users.FindAsync(id);
        if (user is null) return null;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return user;
    }

}
