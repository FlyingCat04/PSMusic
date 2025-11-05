using PSMusic.Server.Models.DTO.Auth;
using PSMusic.Server.Models.DTO.User;

namespace PSMusic.Server.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResDTO> Login(AuthReqDTO user);
        Task<AuthResDTO> Register(CreateUserDTO user);
    }
}
