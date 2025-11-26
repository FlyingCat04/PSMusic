using PSMusic.Server.Models.DTO.Rating;

namespace PSMusic.Server.Services.Interfaces
{
    public interface IRatingService
    {
        Task<List<RatingDTO>> GetSongReviews(int songId);
        Task AddReview(CreateRatingDTO reviewDto);
    }
}
