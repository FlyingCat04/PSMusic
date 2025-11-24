namespace PSMusic.Server.Models.DTO.Song
{
    public class RelatedSongDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Mp3Url { get; set; } = string.Empty;
    }

    public class FavoriteSongDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty; 
        public string ImageUrl { get; set; } = string.Empty; // Map từ AvatarUrl
        public string LyricUrl { get; set; } = string.Empty;
    }
}