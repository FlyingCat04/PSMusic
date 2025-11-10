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
        [HttpGet]
        //[Authorize]
        public async Task<IActionResult> GetAll(int page = 1, int size = 20)
        {
            var result = await _songService.GetAll(page, size);
            return Ok(result);
        }
    }
}
