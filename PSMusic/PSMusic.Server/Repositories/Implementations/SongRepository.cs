using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Data;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using System.Threading.Tasks;

namespace PSMusic.Server.Repositories.Implementations
{
    public class SongRepository : ISongRepository
    {
        private readonly DBContext _dbContext;

        public SongRepository(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Song> GetAll()
        {
            return _dbContext.Song.AsNoTracking();
        }

        public async Task<Song?> GetById(int id)
        {
            Song? song = await _dbContext.Song
                .FirstOrDefaultAsync(s => s.Id == id);
            return song == null ? null : song;
        }

        public async Task<IEnumerable<Song>?> Search(string keyword)
        {
            return await _dbContext.Song
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Where(s => EF.Functions.ILike(EF.Functions.Unaccent(s.Name), EF.Functions.Unaccent($"%{keyword}%"))
                || s.SongArtists.Any(sa => EF.Functions.ILike(EF.Functions.Unaccent(sa.Artist.Name), EF.Functions.Unaccent($"%{keyword}%"))))
                .ToListAsync();
        }
    }
}
