using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Search;
using PSMusic.Server.Models.DTO.Song;

namespace PSMusic.Server.Services.Interfaces
{
    public interface ISongService
    {
        Task<PagedResult<SongDTO>> GetAll(int page, int size);
        Task<SongDetailDTO?> GetById(int id);
        Task<IEnumerable<SongSearchDetailDTO>?> SearchByName(string keyword);
        Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size);
        Task<PagedResult<SongSearchDetailDTO>> GetPopularSongs(int page, int size);
        Task<IEnumerable<NextBatchSongDTO>> GetBatch(int size);
        Task<IEnumerable<SongDTO>?> GetByArtistId(int id);
        Task<PagedResult<SongWithArtistRole>?> GetPopularSongsAsMainArtistAsync(int id, int? userId, int page, int size);
        Task<PagedResult<SongWithArtistRole>?> GetPopularSongsAsCollaboratorAsync(int id, int? userId, int page, int size);
        Task<PagedResult<SongSearchDetailDTO>?> GetPopularSongWithCategory(int id, int? userId, int page, int size);
        Task<SongDetail2DTO?> GetSongDetail(int songId);
        Task<List<RelatedSongDTO>> GetRelatedSongs(int songId);
        Task<SongPlayerDTO?> GetSongForPlayer(int id);
        Task<List<FavoriteSongDTO>> GetFavoriteSongs(int userId);
        Task<int> GetFavoriteCount(int songId);
        Task<bool> ToggleFavorite(int songId, int userId);
        Task<bool> AddStream(int songId, int userId);
    }
}
