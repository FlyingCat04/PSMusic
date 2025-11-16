using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Repositories.Interfaces
{
    public interface IArtistRepository
    {
        Task<IEnumerable<Artist>?> Search(string keyword);
        Task<Artist?> GetById(int id);
        IQueryable<Artist> GetArtistsWithStreamsLast7Days();
    }
}
