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

        public IQueryable<Artist> GetArtistsWithStreamsLast7Days()
        {
            var week = DateTime.UtcNow.AddDays(-7);

            return _dbContext.Artist
                .Where(a => a.SongArtists
                    .Any(sa => sa.Song.Streams.Any(s => s.StreamedAt >= week)))
                .Select(a => new
                {
                    Artist = a,
                    TotalStream = a.SongArtists
                        .Select(sa => sa.Song)
                        .SelectMany(s => s.Streams)
                        .Count(st => st.StreamedAt >= week)
                })
                .OrderByDescending(a => a.TotalStream)
                .Select(x => x.Artist);
        }
    }
}
