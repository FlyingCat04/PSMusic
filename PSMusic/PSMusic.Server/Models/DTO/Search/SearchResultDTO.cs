namespace PSMusic.Server.Models.DTO.Search
{
    public class SearchResultDTO
    {
        // "artist" or "song" or "playlist" but "playlist" has not been covered yet
        public string Type { get; set; } = "song";
        // artist id or song id or playlist id depends on keyword
        public int Id { get; set; }
        // song name or artist name or playlist name
        public string Name { get; set; } = string.Empty;
        // only available of type is not "artist"
        public List<string>? ArtistsName { get; set; } = new List<string>();
    }
}
