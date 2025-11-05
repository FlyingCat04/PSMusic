namespace PSMusic.Server.Models.DTO.Auth
{
    public class AuthResDTO
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Token { get; set; } = null;
    }
}
