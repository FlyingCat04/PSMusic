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
        public string? AvatarUrl { get; set; } = string.Empty;
        public List<ArtistDTO> Artists { get; set; } = new List<ArtistDTO>();
        public List<CategoryDTO> Categories { get; set; } = new List<CategoryDTO>();
        public string Duration { get; set; } = "00:00";

    }

    public class SongSearchDetailDTO
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LrcUrl { get; set; } = string.Empty;
        public string Mp3Url { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = string.Empty;
        public List<PartialArtistDTO> Artists { get; set; } = new List<PartialArtistDTO>();
    }

    public class SongDetail2DTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty; 
        public string ImageUrl { get; set; } = string.Empty;
        public int Favorite { get; set; } 
        public int Reviews { get; set; } 
        public bool IsFavorited { get; set; } 
        public bool IsReviewed { get; set; } 
        public string LyricUrl { get; set; } = string.Empty;
        public string AudioUrl { get; set; } = string.Empty;
        public string Duration { get; set; } = "00:00";

    }

    public class SongPlayerDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty;    // Trong DB là AvatarUrl của bài hát, Client gọi là CoverUrl
        public string SingerUrl { get; set; } = string.Empty;   // Cái này mới: Ảnh đại diện của Ca sĩ
        public int Likes { get; set; }                          // Đổi tên từ FavoriteCount thành Likes cho khớp Client
        public string AudioUrl { get; set; } = string.Empty;    // Mp3Url
        public string LyricUrl { get; set; } = string.Empty;    // LrcUrl
        public bool IsFavorited { get; set; } 
        public bool IsReviewed { get; set; }    
        public string Duration { get; set; } = "00:00";

    }

}
