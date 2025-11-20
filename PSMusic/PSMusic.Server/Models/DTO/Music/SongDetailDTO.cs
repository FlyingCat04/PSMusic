namespace PSMusic.Server.Models.DTO.Music
{
    public class SongDetailDTO
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
    }
}