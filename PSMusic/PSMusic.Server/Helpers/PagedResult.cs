namespace PSMusic.Server.Helpers
{
    public class PagedResult<T>
    {
        public IEnumerable<T> Items { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalItems / Limit);

        public PagedResult(IEnumerable<T> items, int page, int limit, int totalItems)
        {
            Items = items;
            Page = page;
            Limit = limit;
            TotalItems = totalItems;
        }
    }

}
