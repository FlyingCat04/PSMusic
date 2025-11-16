using AutoMapper;
using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Category;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<PagedResult<CategoryDTO>> GetPopularCategories(int page, int size)
        {
            var query = _categoryRepository.GetCategoriesWithStreamsLast7Days();

            var categories = query.Select(c => _mapper.Map<CategoryDTO>(c));
            return await categories.PaginateAsync(page, size);
        }
    }
}
