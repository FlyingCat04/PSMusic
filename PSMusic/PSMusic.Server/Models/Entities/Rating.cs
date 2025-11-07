using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Rating
    {
        [Key]
        public int Id { get; set; }
        public int Value { get; set; }
        public string Review { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
