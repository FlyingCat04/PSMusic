using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.DTO.Song
{
    public class SongDTO
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LrcUrl { get; set; } = string.Empty;
        public string Mp3Url { get; set; } = string.Empty;
        public List<int> ArtistIds { get; set; } = new List<int>();
        public List<int> CategoryIds { get; set; } = new List<int>();
    }
}
