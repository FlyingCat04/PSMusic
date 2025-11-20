using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Playlist
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public string Title { get; set; } = string.Empty;
        public bool IsPublic { get; set; } = false;
        public string? AvatarUrl { get; set; }
        public ICollection<SongPlaylist> SongPlaylists { get; set; } = new List<SongPlaylist>();
    }
}
