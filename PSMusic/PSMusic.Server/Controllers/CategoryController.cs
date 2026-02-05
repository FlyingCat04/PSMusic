using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService) 
        {
            _categoryService = categoryService;
        }

        // GET api/category/popular?page=1&size=10
        [HttpGet("popular")]
        //[Authorize]
        [OutputCache(Duration = 900)]
        public async Task<IActionResult> GetPopularCategories(int page = 1, int size = 10)
        {
            var popularCategories = await _categoryService.GetPopularCategories(page, size);
            return Ok(popularCategories);
        }

        [HttpGet("{id:int}")]
        //[Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _categoryService.GetById(id);
            return Ok(result);
        }
    }
}
