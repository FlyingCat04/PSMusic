using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Artist
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string AvatarURL { get; set; } = string.Empty;
        public ICollection<SongArtist> SongArtists { get; set; } = new List<SongArtist>();
    }
}