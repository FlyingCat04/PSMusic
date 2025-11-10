using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.DTO.Category;
using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.DTO.Song
{
    public class SongDetailDTO
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LrcUrl { get; set; } = string.Empty;
        public string Mp3Url { get; set; } = string.Empty;
        public List<ArtistDTO> Artists { get; set; } = new List<ArtistDTO>();
        public List<CategoryDTO> Categories { get; set; } = new List<CategoryDTO>();

    }
}
