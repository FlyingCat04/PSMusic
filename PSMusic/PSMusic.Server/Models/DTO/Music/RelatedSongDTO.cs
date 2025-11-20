namespace PSMusic.Server.Models.DTO.Music
{
    public class RelatedSongDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Mp3Url { get; set; } = string.Empty;
    }
}