using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Song
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int ArtistId { get; set; }
        public Artist Artist { get; set; } = null!;
        public ICollection<SongCategory> SongCategories { get; set; } = new List<SongCategory>();
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    }
}
