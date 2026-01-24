using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Category;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Controllers
{
    [Route("api/artist")]
    [ApiController]
    public class ArtistController : ControllerBase
    {
        private readonly IArtistService _artistService;
        private readonly ICategoryService _categoryService;

        public ArtistController(IArtistService artistService, ICategoryService categoryService)
        {
            _artistService = artistService;
            _categoryService = categoryService;
        }

        // GET api/artist/popular?page=1&size=10
        [HttpGet("popular")]
        //[Authorize]
        public async Task<IActionResult> GetPopularArtists(int page = 1, int size = 10)
        {
            var result = await _artistService.GetPopularArtists(page, size);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetArtistDetail(int id)
        {
            var result = await _artistService.GetById(id);
            return Ok(result);
        }

        [HttpGet("related/{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetRelatedArtist(int id)
        {
            var mainCategory = await _categoryService.GetMainCategoryOfAnArtist(id);
            if (mainCategory == null) return Ok();

            var result = await _artistService.GetArtistsByMainCategory(mainCategory.Id);
            var filteredResult = result?.Where(a => a.Id != id);
            return Ok(filteredResult);
        }
        
        // GET: api/artist/1/artists
        [HttpGet("{id}/artists")]
        //[Authorize]
        public async Task<IActionResult> GetSongArtists(int id)
        {
            var artists = await _artistService.GetArtistsBySongId(id);
            return Ok(artists);
        }

        [HttpGet("category/{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetArtistByMainCategory(int id, int page = 1, int size = 10)
        {
            var artists = await _artistService.GetArtistsByMainCategory(id);
            var result = artists?.Paginate(page, size);
            return Ok(result);
        }
    }
}
