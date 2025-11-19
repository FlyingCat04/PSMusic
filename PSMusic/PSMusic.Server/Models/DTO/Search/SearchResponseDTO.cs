namespace PSMusic.Server.Models.DTO.Search
{
    public class SearchResponseDTO
    {
        public SearchResultDTO? TopResult { get; set; } = null;
        public List<SearchResultDTO> Results { get; set; } = new List<SearchResultDTO>();
        public int TotalPages { get; set; }
    }
}
