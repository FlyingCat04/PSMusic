namespace PSMusic.Server.Models.Entities
{
    public class SongCategory
    {
        public int SongId { get; set; }
        public Song Song { get; set; } = null!;

        public int CategoryId { get; set; }
        public Category Category { get; set; } = null!;
    }
}
