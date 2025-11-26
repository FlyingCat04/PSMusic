using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Services.Interfaces;
using PSMusic.Server.Models.DTO.Rating;
using System.Security.Claims;

namespace PSMusic.Server.Controllers
{
    [Route("api/rating")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        public RatingController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        // GET: api/rating/1/reviews
        [HttpGet("{songId}/reviews")]
        [Authorize]
        public async Task<ActionResult> GetSongReviews(int songId)
        {
            var reviews = await _ratingService.GetSongReviews(songId);
            return Ok(reviews);
        }   

        // POST: api/rating/1/add-review
        [HttpPost("{id}/add-review")]
        [Authorize]
        public async Task<IActionResult> AddReview(int id, [FromBody] CreateRatingDTO input)
        {
            var userId_str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = userId_str != null ? int.Parse(userId_str) : 0 ;    // Default 0 if userId is not provided
            if (userId <= 0) return BadRequest(new { message = "UserId không hợp lệ" });

            input.UserId = userId;
            input.SongId = id; 
            try {
                await _ratingService.AddReview(input);
                return Ok(new { message = "Đánh giá thành công!" });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }



    }
}
