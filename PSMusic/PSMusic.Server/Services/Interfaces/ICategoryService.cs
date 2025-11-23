using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Category;

namespace PSMusic.Server.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<PagedResult<CategoryDTO>> GetPopularCategories(int page, int size);
        Task<CategoryDTO?> GetMainCategoryOfAnArtist(int id);
        Task<CategoryDTO?> GetById(int id);
    }
}
