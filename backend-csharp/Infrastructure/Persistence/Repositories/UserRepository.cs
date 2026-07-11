using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Infrastructure.Persistence.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<User?> GetByIdAsync(Guid id)
        => await _context.Users.FindAsync(id);

    public async Task<User?> GetByEmailAsync(string email)
        => await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User?> UpdateByIdAsync(Guid id, User user)
    {
        if (user == null) return null;

        User? userDb = await _context.Users.FindAsync(id);
        if (userDb is null) return null;

        // Update the user properties
        userDb.Name = user.Name;
        userDb.Email = user.Email;
        userDb.Age = user.Age;
        userDb.Password = user.Password;

        await _context.SaveChangesAsync();
        return userDb;
    }

    public async Task<User?> DeleteByIdAsync(Guid id)
    {
        User? user = await _context.Users.FindAsync(id);
        if (user is null) return null;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return user;
    }

}
