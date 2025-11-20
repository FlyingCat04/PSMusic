namespace PSMusic.Server.Models.Entities
{
    public class SongPlaylist
    {
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;
        public int PlaylistId { get; set; }
        public Playlist Playlist { get; set; } = null!;
    }
}
