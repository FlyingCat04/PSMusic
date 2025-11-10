using PSMusic.Server.Models.DTO.Artist;

namespace PSMusic.Server.Services.Interfaces
{
    public interface IArtistService
    {
        Task<IEnumerable<ArtistDTO>>? SearchByName(string keyword);
        Task<ArtistDTO?> GetById(int id);
    }
}
