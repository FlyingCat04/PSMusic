namespace PSMusic.Server.Models.DTO.Auth
{
    public class RefreshTokenReqDTO
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class RefreshTokenResDTO
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
    }
}
