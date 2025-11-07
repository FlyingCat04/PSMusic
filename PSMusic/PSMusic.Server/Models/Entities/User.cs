using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        [MinLength(8)]
        public string Password { get; private set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        [MaxLength(30)]
        public string DisplayName { get; set; } = string.Empty;
        public string? AvatarURL { get; set; }
        //public string Type { get; set; } = "customer";
        public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
        public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();

        public void SetPassword(string password)
        {
            Password = BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, Password);
        }
    }
}
