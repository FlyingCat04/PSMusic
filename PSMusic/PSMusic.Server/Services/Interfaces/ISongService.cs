using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Search;
using PSMusic.Server.Models.DTO.Song;

namespace PSMusic.Server.Services.Interfaces
{
    public interface ISongService
    {
        Task<PagedResult<SongDTO>> GetAll(int page, int size);
        Task<SongDetailDTO?> GetById(int id);
        Task<IEnumerable<SongDTO>?> SearchByName(string keyword);
        Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size);
        Task<PagedResult<SongDTO>> GetPopularSongs(int page, int size);
        Task<SongDetail2DTO?> GetSongDetail(int songId, int userId);
        Task<List<RelatedSongDTO>> GetRelatedSongs(int songId);
    }
}
