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
    }
}
