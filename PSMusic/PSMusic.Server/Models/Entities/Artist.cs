using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class Artist
    {
        [Key]
        public int Id { get; set; }
        public string AvatarURL { get; set; } = string.Empty;
    }
}