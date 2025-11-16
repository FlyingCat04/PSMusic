using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        IQueryable<Category> GetCategoriesWithStreamsLast7Days();
    }
}
