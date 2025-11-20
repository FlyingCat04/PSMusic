using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Controllers
{
    [Route("api/artist")]
    [ApiController]
    public class ArtistController : ControllerBase
    {
        private readonly IArtistService _artistService;

        public ArtistController(IArtistService artistService)
        {
            _artistService = artistService;
        }

        // GET api/artist/popular?page=1&size=10
        [HttpGet("popular")]
        [Authorize]
        public async Task<IActionResult> GetPopularArtists(int page = 1, int size = 10)
        {
            var result = await _artistService.GetPopularArtists(page, size);
            return Ok(result);
        }

        // GET: api/artist/1/artists
        [HttpGet("{id}/artists")]
        [Authorize]
        public async Task<ActionResult> GetSongArtists(int id)
        {
            var artists = await _artistService.GetArtistsBySongId(id);
            return Ok(artists);
        }
    }
}
