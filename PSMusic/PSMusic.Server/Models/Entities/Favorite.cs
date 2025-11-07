namespace PSMusic.Server.Models.Entities
{
    public class Favorite
    {
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;
        public bool IsFavorite { get; set; }
    }
}
