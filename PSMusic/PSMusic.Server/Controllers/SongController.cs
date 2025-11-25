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
        private readonly IArtistService _artistService;

        public SongController(ISongService songService, IArtistService artistService)
        {
            _songService = songService;
            _artistService = artistService;
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
        //[Authorize]
        public async Task<IActionResult> GetNextBatch(int size = 10)
        {
            var randomSongs = await _songService.GetBatch(size);
            foreach (var s in randomSongs)
            {
                s.Likes = await _songService.GetFavoriteCount(s.Id);
                var mainArtist = await _artistService.GetArtistsBySongId(s.Id);
                s.SingerUrl = mainArtist.FirstOrDefault()?.AvatarUrl ?? string.Empty;
            }

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
        
        // GET api/song/1/detail?userId=5
        [HttpGet("{songId}/detail")]
        [Authorize]
        public async Task<IActionResult> GetSongDetail(int songId, [FromQuery] int? userId)
        {
            int currentUserId = userId ?? 0;    // Default 0 if userId is not provided
            var result = await _songService.GetSongDetail(songId, currentUserId);
            if (result == null) return NotFound(new { message = "Không tìm thấy bài hát" });
            return Ok(result);
        }

        // GET: api/song/1/related
        [HttpGet("{id}/related")]
        [Authorize]
        public async Task<ActionResult> GetRelatedSongs(int id)
        {
            var songs = await _songService.GetRelatedSongs(id);
            return Ok(songs);
        }

        // GET: api/song/1/player
        [HttpGet("{songId}/player")]
        [Authorize]
        public async Task<ActionResult> GetSongForPlayer(int songId)
        {
            var song = await _songService.GetSongForPlayer(songId);
            return Ok(song);
        }

        // GET: api/songs/favorites?userId=1
        [HttpGet("favorites")]
        [Authorize]        
        public async Task<ActionResult> GetFavoriteSongs([FromQuery] int userId)
        {
            if (userId <= 0) return BadRequest(new { message = "UserId không hợp lệ" });
            var songs = await _songService.GetFavoriteSongs(userId);
            return Ok(songs);
        }


    }
}
