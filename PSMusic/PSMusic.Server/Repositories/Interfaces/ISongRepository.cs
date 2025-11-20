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
        Task<SongDetail2DTO?> GetSongDetail_DTO(int songId, int userId);
        Task<List<Song>> GetRelatedSongs(int songId);
    }
}
