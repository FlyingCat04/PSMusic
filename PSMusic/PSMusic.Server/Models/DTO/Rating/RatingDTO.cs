namespace PSMusic.Server.Models.DTO.Rating
{
    public class RatingDTO
    {
        public int Id { get; set; }
        public string User { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
    }

    public class CreateRatingDTO
    {
        public int UserId { get; set; }
        public int SongId { get; set; }
        public int Rating { get; set; } 
        public string Comment { get; set; } = string.Empty; 
    }
}