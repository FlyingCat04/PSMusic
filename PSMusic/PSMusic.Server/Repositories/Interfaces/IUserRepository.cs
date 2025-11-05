using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByUsername(string username);
        Task<User?> GetUserById(int id);
        Task<bool> Add(User user);
        Task<bool> CheckEmailExistence(string email);
    }
}
