using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Repositories.Interfaces
{
    public interface ISongRepository
    {
        IQueryable<Song> GetAll();
        Task<Song?> GetById(int id);
        Task<IEnumerable<Song>?> Search(string keyword);
        IQueryable<Song> GetSongsWithStreamsLast7Days();
        Task<IEnumerable<Song>> GetRandomSongsAsync(int count);
        Task<IEnumerable<Song>?> GetByArtistId(int id);
        Task<IEnumerable<Song>?> GetPopularSongWithCategory(int id);
        Task<SongDetail2DTO?> GetSongDetail_DTO(int songId, int userId);
        Task<List<Song>> GetRelatedSongs(int songId);
        Task<SongPlayerDTO?> GetSongForPlayer_DTO(int id);
        Task<List<FavoriteSongDTO>> GetFavoriteSongs(int userId);
        Task<int> GetFavoriteCount(int songId);
        Task<bool> ToggleFavorite(int songId, int userId);
    }
}
