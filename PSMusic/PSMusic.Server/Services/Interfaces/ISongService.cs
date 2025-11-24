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
        Task<IEnumerable<SongDTO>> GetBatch(int size);
        Task<IEnumerable<SongDTO>?> GetByArtistId(int id);
        Task<PagedResult<SongWithArtistRole>?> GetPopularSongsAsMainArtistAsync(int id, int page, int size);
        Task<PagedResult<SongWithArtistRole>?> GetPopularSongsAsCollaboratorAsync(int id, int page, int size);
        Task<PagedResult<SongDTO>?> GetPopularSongWithCategory(int id, int page, int size);
        Task<SongDetail2DTO?> GetSongDetail(int songId, int userId);
        Task<List<RelatedSongDTO>> GetRelatedSongs(int songId);
        Task<SongPlayerDTO?> GetSongForPlayer(int id);
        Task<List<FavoriteSongDTO>> GetFavoriteSongs(int userId);
    }
}
