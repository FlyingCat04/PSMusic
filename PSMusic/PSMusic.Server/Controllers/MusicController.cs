using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Models.DTO.Music;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Controllers
{
    [Route("api/music")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly IMusicService _songService;

        public MusicController(IMusicService songService)
        {
            _songService = songService;
        }

        // GET: api/music/1?userId=5
        [HttpGet("{id}")]
        public async Task<ActionResult<SongDetailDTO>> GetSongDetail(int id, [FromQuery] int? userId)
        {
            // Nếu không truyền userId (khách vãng lai), mặc định là 0
            int currentUserId = userId ?? 0;

            var result = await _songService.GetSongDetailAsync(id, currentUserId);

            if (result == null) return NotFound(new { message = "Không tìm thấy bài hát" });
            return Ok(result);
        }

        // GET: api/music/1/artists
        [HttpGet("{id}/artists")]
        public async Task<ActionResult<List<ArtistDTO>>> GetSongArtists(int id)
        {
            var artists = await _songService.GetArtistsBySongIdAsync(id);
            return Ok(artists);
        }

        // GET: api/music/1/related
        [HttpGet("{id}/related")]
        public async Task<ActionResult<List<RelatedSongDTO>>> GetRelatedSongs(int id)
        {
            var songs = await _songService.GetRelatedSongsAsync(id);
            return Ok(songs);
        }
    }
}
