using AutoMapper;
using PSMusic.Server.Models.DTO.Rating;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IMapper _mapper;

        public RatingService(IRatingRepository ratingRepository, IMapper mapper) 
        {
            _ratingRepository = ratingRepository;
            _mapper = mapper;
        }

        public async Task<List<RatingDTO>> GetSongReviews(int songId)
        {
            return await _ratingRepository.GetSongReviews(songId);
        }

        public async Task AddReview(CreateRatingDTO reviewDto)
        {
            var ratingEntity = _mapper.Map<Rating>(reviewDto);
            // ratingEntity.CreatedAt = DateTime.UtcNow; 
            await _ratingRepository.AddRating(ratingEntity);
        }

    }
}
