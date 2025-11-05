using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.DTO.User
{
    public class UserDTO
    {
        [Key]
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? AvatarURL { get; set; }
    }
}