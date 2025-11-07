using PSMusic.Server.Models.DTO.User;

namespace PSMusic.Server.Services.Interfaces
{
    public interface IUserService
    {
        Task<UserDTO?> GetUserById(int id);
    }
}
