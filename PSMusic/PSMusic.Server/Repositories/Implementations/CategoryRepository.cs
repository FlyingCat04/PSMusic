using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Data;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;

namespace PSMusic.Server.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DBContext _dbContext;

        public CategoryRepository(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Category> GetCategoriesWithStreamsLast7Days()
        {
            var week = DateTime.UtcNow.AddDays(-7);

            return _dbContext.Category
                .Where(c => c.SongCategories
                    .Any(sc => sc.Song.Streams.Any(st => st.StreamedAt >= week)))
                .Select(c => new 
                {
                    Category = c,
                    TotalStream = c.SongCategories
                        .Select(sc => sc.Song)
                        .SelectMany(s => s.Streams)
                        .Count(st => st.StreamedAt >= week)
                })
                .OrderByDescending(x => x.TotalStream)
                .Select(x => x.Category);
        }

        public async Task<Category?> GetMainCategoryOfAnArtist(int artistId)
        {
            var result = await _dbContext.Song
                .Where(s => s.SongArtists.Any(sa => sa.ArtistId == artistId))
                .SelectMany(s => s.SongCategories)
                .GroupBy(sc => sc.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    SongCount = g.Count()
                })
                .OrderByDescending(x => x.SongCount)
                .FirstOrDefaultAsync();

            return result?.Category;
        }

        public async Task<Category?> GetById(int id)
        {
            return await _dbContext.Category
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();
        }
    }
}
