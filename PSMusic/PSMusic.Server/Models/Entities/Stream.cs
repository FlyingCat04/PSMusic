using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Stream
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;
        public DateTime StreamedAt { get; set; } = DateTime.UtcNow;
    }
}
