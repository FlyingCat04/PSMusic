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
        // min size of a page is 20 elements
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll(int page = 1, int size = 20)
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
    }
}
