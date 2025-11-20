namespace PSMusic.Server.Models.DTO.Artist
{
    public class ArtistDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; } = string.Empty;
    }
}
