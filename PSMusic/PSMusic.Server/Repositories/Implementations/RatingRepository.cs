using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Data;
using PSMusic.Server.Models.DTO.Rating;
using PSMusic.Server.Repositories.Interfaces;

namespace PSMusic.Server.Repositories.Implementations
{
    public class RatingRepository : IRatingRepository
    {
        private readonly DBContext _dbContext;

        public RatingRepository(DBContext dbContext) 
        {
            _dbContext = dbContext;
        }

        public async Task<List<RatingDTO>> GetSongReviews(int songId)
        {
            return await _dbContext.Rating
                .AsNoTracking()
                .Where(r => r.SongId == songId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new RatingDTO
                {
                    Id = r.Id,
                    User = r.User.DisplayName, 
                    Rating = r.Value,
                    Comment = r.Review,                    
                    Date = r.CreatedAt.ToString("yyyy-MM-dd") // Nếu báo lỗi, sửa CreatedAt thành DateTime rồi format ở Service/Client
                })
                .ToListAsync();
        }

        public async Task AddRating(Rating rating)
        {
            await _dbContext.Rating.AddAsync(rating);
            await _dbContext.SaveChangesAsync();
        }

    }
}