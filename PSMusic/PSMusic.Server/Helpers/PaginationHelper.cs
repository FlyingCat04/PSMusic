using Microsoft.EntityFrameworkCore;

namespace PSMusic.Server.Helpers
{
    public static class PaginationHelper
    {
        public static async Task<PagedResult<T>> PaginateAsync<T>(
            this IQueryable<T> query,
            int page,
            int size)
        {
            var totalItems = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return new PagedResult<T>(items, page, size, totalItems);
        }
    }
}
