using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Song
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LrcUrl { get; set; } = string.Empty;
        public string Mp3Url { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ICollection<SongArtist> SongArtists { get; set; } = new List<SongArtist>();
        public ICollection<SongCategory> SongCategories { get; set; } = new List<SongCategory>();
        //public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<Stream> Streams { get; set; } = new List<Stream>();
        public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
    }
}
