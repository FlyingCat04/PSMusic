using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
        [Authorize]
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
            var filteredResult = result.Select(a => a.Id != id);
            return Ok(filteredResult);
        }
    }
}
