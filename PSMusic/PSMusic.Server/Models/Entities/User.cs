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
        public string Name { get; set; } = string.Empty;
        public string? AvatarURL { get; set; }
        public string Type { get; set; } = "customer";

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
