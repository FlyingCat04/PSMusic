using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Data;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using System.Runtime.CompilerServices;

namespace PSMusic.Server.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly DBContext _dbContext;

        public UserRepository(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User?> GetUserByUsername(string username)
        {
            User? user = await _dbContext.User
                .FirstOrDefaultAsync(u => u.Username == username);
            return user == null ? null : user;
        }

        public async Task<bool> Add(User user)
        {
            try
            {
                await _dbContext.User.AddAsync(user);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateException e) 
            {
                Console.WriteLine($"Add a new user failed: {e.Message}");
                return false;
            }
            
        }

        // return true if email exists and vice versa
        public async Task<bool> CheckEmailExistence(string email)
        {
            return await _dbContext.User.AnyAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _dbContext.User.FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
