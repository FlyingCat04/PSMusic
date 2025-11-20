using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Data;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;

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
            return _dbContext.Song
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
                .AsNoTracking();
        }

        public async Task<Song?> GetById(int id)
        {
            Song? song = await _dbContext.Song
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
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

        public async Task<(IEnumerable<Song> Songs, int TotalCount)> SearchPaging(string keyword, int page, int size)
        {
            var query = _dbContext.Song
                .Include(s => s.SongArtists).ThenInclude(sa => sa.Artist)
                .Where(s =>
                    EF.Functions.ILike(EF.Functions.Unaccent(s.Name), EF.Functions.Unaccent($"%{keyword}%")) ||
                    s.SongArtists.Any(sa => EF.Functions.ILike(EF.Functions.Unaccent(sa.Artist.Name), EF.Functions.Unaccent($"%{keyword}%")))
                );

            int total = await query.CountAsync();

            var result = await query
                .OrderBy(s => s.Name)             
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (result, total);
        }


        public IQueryable<Song> GetSongsWithStreamsLast7Days()
        {
            var week = DateTime.UtcNow.AddDays(-7);

            return _dbContext.Song
                .Where(s => _dbContext.Stream
                    .Any(st => st.SongId == s.Id && st.StreamedAt >= week))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
                .OrderByDescending(s => _dbContext.Stream
                    .Count(st => st.SongId == s.Id && st.StreamedAt >= week));
        }
    }
}
