using System.ComponentModel.DataAnnotations;

namespace PSMusic.Server.Models.DTO.Category
{
    public class CategoryDTO
    {
        [Key]
        public int Id { get; set; }
        public string? AvatarUrl { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}
