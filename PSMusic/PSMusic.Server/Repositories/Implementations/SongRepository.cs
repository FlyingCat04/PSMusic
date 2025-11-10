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
            Song? song = await _dbContext
                .Song.FirstOrDefaultAsync(s => s.Id == id);
            return song == null ? null : song;
        }
    }
}
