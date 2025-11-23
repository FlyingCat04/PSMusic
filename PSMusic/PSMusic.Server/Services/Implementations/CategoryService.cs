using AutoMapper;
using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.DTO.Category;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;
using System.Runtime.CompilerServices;

namespace PSMusic.Server.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IArtistService _artistService;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IArtistService artistService, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _artistService = artistService;
            _mapper = mapper;
        }

        public async Task<PagedResult<CategoryDTO>> GetPopularCategories(int page, int size)
        {
            var query = _categoryRepository.GetCategoriesWithStreamsLast7Days();

            var categories = query.Select(c => _mapper.Map<CategoryDTO>(c));
            return await categories.PaginateAsync(page, size);
        }

        public async Task<CategoryDTO?> GetMainCategoryOfAnArtist(int id)
        {
            var existing = await _artistService.GetById(id);
            if (existing == null) return null;

            var mainCategory = await _categoryRepository.GetMainCategoryOfAnArtist(id);
            return mainCategory == null ? null : _mapper.Map<CategoryDTO>(mainCategory);
        }

        public async Task<CategoryDTO?> GetById(int id)
        {
            var result = await _categoryRepository.GetById(id);
            return result == null ? null : _mapper.Map<CategoryDTO>(result);
        }
    }
}
