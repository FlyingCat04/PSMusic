using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Data;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;

namespace PSMusic.Server.Repositories.Implementations
{
    public class ArtistRepository : IArtistRepository
    {
        private readonly DBContext _dbContext;

        public ArtistRepository(DBContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Artist>?> Search(string keyword)
        {
            return await _dbContext.Artist
                .Where(a => EF.Functions.ILike(EF.Functions.Unaccent(a.Name), EF.Functions.Unaccent($"%{keyword}%")))
                .ToListAsync();
        }

        public async Task<Artist?> GetById(int id)
        {
            Artist? artist = await _dbContext.Artist
                .FirstOrDefaultAsync(a => a.Id == id);
            return artist == null ? null : artist;
        }
    }
}
