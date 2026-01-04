namespace PSMusic.Server.Models.DTO.Song
{
    public class NextBatchSongDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public List<string> ArtistNames { get; set; } = new List<string>();
        public string CoverUrl { get; set; } = string.Empty;
        public string SingerUrl { get; set; } = string.Empty;
        // favorites
        public int Likes { get; set; }
        public string AudioUrl { get; set; } = string.Empty;
        public string LyricUrl { get; set; } = string.Empty;
        public string Duration { get; set; } = "00:00";
    }
}
