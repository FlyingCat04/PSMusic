using PSMusic.Server.Models.DTO.Rating;
using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Repositories.Interfaces
{
    public interface IRatingRepository
    {
        Task<List<RatingDTO>> GetSongReviews(int songId);
        Task AddRating(Rating rating);
    }
}
