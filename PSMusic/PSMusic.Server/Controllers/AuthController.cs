using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Models.DTO.Auth;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Services.Interfaces;
using System.Security.Claims;

namespace PSMusic.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _env;

        public AuthController(IAuthService authService, IUserService userService, IWebHostEnvironment env)
        {
            _authService = authService;
            _userService = userService;
            _env = env;
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Path = "/",
                Expires = DateTime.UtcNow.AddDays(7),

                Secure = true,

                SameSite = SameSiteMode.None
            };

            Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);
        }

        private void RemoveRefreshTokenCookie()
        {
            // Khi xóa cookie, các option (Path, Secure, SameSite) phải trùng khớp với lúc tạo
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Path = "/",
                Secure = Request.IsHttps,
                SameSite = Request.IsHttps ? SameSiteMode.None : SameSiteMode.Lax
            };

            Response.Cookies.Delete("RefreshToken", cookieOptions);
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CreateUserDTO user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { IsSuccess = false, message = "Dữ liệu không hợp lệ." });
            }

            var result = await _authService.Register(user);
            if (result.IsSuccess) return Ok(new { result.IsSuccess, result.Message });
            else return BadRequest(new { result.IsSuccess, result.Message });
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthReqDTO req)
        {
            var result = await _authService.Login(req);
            if (result.IsSuccess && result.Token != null)
            {
                if (result.RefreshToken != null)
                {
                    SetRefreshTokenCookie(result.RefreshToken);
                }

                if (!result.UserId.HasValue) return Unauthorized();
                var user = await _userService.GetUserById(result.UserId.Value);
                return Ok(new
                {
                    result.IsSuccess,
                    result.Message,
                    result.Token,
                    User = new
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        DisplayName = user.DisplayName,
                        AvatarUrl = user.AvatarURL
                    }
                });
            }
            else return BadRequest(new { result.IsSuccess, result.Message });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["RefreshToken"];
            if (string.IsNullOrEmpty(refreshToken))
            {
                return Ok(new { IsSuccess = false, Message = "Refresh token không tìm thấy" });
            }

            var result = await _authService.Refresh(refreshToken);
            if (result.IsSuccess)
            {
                if (!string.IsNullOrEmpty(result.RefreshToken))
                {
                    SetRefreshTokenCookie(result.RefreshToken);
                }

                if (!result.UserId.HasValue) return Unauthorized();
                var user = await _userService.GetUserById(result.UserId.Value);

                return Ok(new
                {
                    result.IsSuccess,
                    result.Message,
                    result.Token,
                    User = new
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        DisplayName = user.DisplayName,
                        AvatarUrl = user.AvatarURL
                    }
                });
            }

            return Ok(new { result.IsSuccess, result.Message });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null) return Unauthorized();

            var user = await _userService.GetUserById(int.Parse(userIdClaim));
            if (user == null) return Unauthorized();

            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                DisplayName = user.DisplayName,
            });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null) return Unauthorized();

            var user = await _userService.GetUserById(int.Parse(userIdClaim));
            if (user == null) return Unauthorized();

            RemoveRefreshTokenCookie();

            return Ok(new { IsSuccess = true, Message = "Đăng xuất thành công" });
        }
    }
}