using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Services.Interfaces;
using System.Security.Claims;

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

        // GET api/song/1/detail
        [HttpGet("{songId}/detail")]
        [Authorize]
        public async Task<IActionResult> GetSongDetail(int songId)
        {
            var userId_str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = userId_str != null ? int.Parse(userId_str) : 0;    // Default 0 if userId is not provided
            var result = await _songService.GetSongDetail(songId, userId);
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
            var userId_str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = userId_str != null ? int.Parse(userId_str) : 0 ;    // Default 0 if userId is not provided

            if (userId <= 0) return BadRequest(new { message = "UserId không hợp lệ" });

            var song = await _songService.GetSongForPlayer(songId, userId);
            return Ok(song);
        }

        // GET: api/song/favorites
        [HttpGet("favorites")]
        [Authorize]
        public async Task<ActionResult> GetFavoriteSongs()
        {
            var userId_str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = userId_str != null ? int.Parse(userId_str) : 0;    // Default 0 if userId is not provided

            if (userId <= 0) return BadRequest(new { message = "UserId không hợp lệ" });
            var songs = await _songService.GetFavoriteSongs(userId);
            return Ok(songs);
        }

        // POST: api/song/1/favorite-toggle
        [HttpPost("{id}/favorite-toggle")]
        [Authorize]
        public async Task<ActionResult> ToggleFavorite(int id)
        {
            var userId_str = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            int userId = userId_str != null ? int.Parse(userId_str) : 0;    // Default 0 if userId is not provided

            if (userId <= 0) return BadRequest(new { message = "UserId không hợp lệ" });
            try {
                bool isFavorited = await _songService.ToggleFavorite(id, userId);

                return Ok(new {
                    message = isFavorited ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích",
                    isFavorited = isFavorited
                });
            } catch (Exception ex) {
                return BadRequest(new { message = "Lỗi xử lý: " + ex.Message });
            }
        }

        // POST: api/song/stream/1
        [HttpPost("stream/{songId:int}")]
        [Authorize]
        public async Task<IActionResult> AddStream(int songId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return BadRequest(new { message = "UserId không hợp lệ" });
            var result = await _songService.AddStream(songId, int.Parse(userId));
            if (result) return Ok();
            else return BadRequest();
        }
    }
}
