using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Controllers
{
    [Route("api/song")]
    [ApiController]
    public class SongController : ControllerBase
    {
        private readonly ISongService _songService;

        public SongController(ISongService songService)
        {
            _songService = songService;
        }

        // GET api/song?page=1&size=20
        // min size of a page is 10 elements
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll(int page = 1, int size = 10)
        {
            var result = await _songService.GetAll(page, size);
            return Ok(result);
        }

        // GET api/song/search?keyword=abc
        [HttpGet("search")]
        //[Authorize]
        public async Task<IActionResult> Search(string keyword, int page = 1, int size = 10)
        {
            var result = await _songService.SearchAll(keyword, page, size);
            return Ok(result);
        }

        // GET api/song/popular?page=1&size=10
        [HttpGet("popular")]
        [Authorize]
        public async Task<IActionResult> GetPopularSong(int page = 1, int size = 10)
        {
            var popularSongs = await _songService.GetPopularSongs(page, size);
            return Ok(popularSongs);
        }

        [HttpGet("next-batch")]
        [Authorize]
        public async Task<IActionResult> GetNextBatch(int size = 10)
        {
            var randomSongs = await _songService.GetBatch(size);
            return Ok(randomSongs);
        }

        [HttpGet("artist/main/{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetMainSongByArtistId(int id, int page = 1, int size = 10)
        {
            var test = await _songService.GetPopularSongsAsMainArtistAsync(id, page, size);
            return Ok(test);
        }

        [HttpGet("artist/collab/{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetCollabSongByArtistId(int id, int page = 1, int size = 10)
        {
            var test = await _songService.GetPopularSongsAsCollaboratorAsync(id, page, size);
            return Ok(test);
        }

        [HttpGet("category/popular/{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetPopularSongByCategory(int id, int page = 1, int size = 10)
        {
            var test = await _songService.GetPopularSongWithCategory(id, page, size);
            return Ok(test);
        }
    }
}
