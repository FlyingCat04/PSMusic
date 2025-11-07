using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Services.Interfaces
{
    public interface ITokenGenerator
    {
        string GenerateToken(User user);
    }
}
