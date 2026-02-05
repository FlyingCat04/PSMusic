using PSMusic.Server.Models.DTO.Artist;

namespace PSMusic.Server.Models.DTO.Song
{
    public class SearchDocument
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string AvatarUrl { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }

        public string Mp3Url { get; set; }
        public string Duration { get; set; }
        public IEnumerable<PartialArtistDTO> Artists { get; set; }
    }
}
