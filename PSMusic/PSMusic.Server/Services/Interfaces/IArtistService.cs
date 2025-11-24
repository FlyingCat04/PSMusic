using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Artist;

namespace PSMusic.Server.Services.Interfaces
{
    public interface IArtistService
    {
        Task<IEnumerable<ArtistDTO>>? SearchByName(string keyword);
        Task<ArtistDTO?> GetById(int id);
        Task<PagedResult<ArtistDTO>> GetPopularArtists(int page, int size);
        Task<IEnumerable<ArtistDTO>?> GetArtistsByMainCategory(int categoryId);
        Task<List<ArtistDTO>> GetArtistsBySongId(int songId);
    }
}