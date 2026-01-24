using PSMusic.Server.Models.Entities;
using System.Security.Claims;

namespace PSMusic.Server.Services.Interfaces
{
    public interface ITokenGenerator
    {
        string GenerateToken(User user);
        string GenerateRefreshToken(User user);
        ClaimsPrincipal? ValidateRefreshToken(string token);
    }
}
