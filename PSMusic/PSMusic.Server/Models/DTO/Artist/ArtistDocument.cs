namespace PSMusic.Server.Models.DTO.Artist
{
    public class ArtistDocument
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = "artist";
        public string? AvatarUrl { get; set; } = string.Empty;
    }
}
