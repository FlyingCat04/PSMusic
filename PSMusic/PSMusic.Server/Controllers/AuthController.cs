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
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Path = "/",
                    Expires = DateTime.UtcNow.AddMinutes(10080) // 7 days
                };
                if(_env.IsDevelopment())
                {
                    cookieOptions.Secure = true;
                    cookieOptions.SameSite = SameSiteMode.None;
                } else
                {
                    cookieOptions.Secure = false;
                    cookieOptions.SameSite = SameSiteMode.Lax;
                }
                if (result.RefreshToken != null)
                {
                    Response.Cookies.Append("RefreshToken", result.RefreshToken, cookieOptions);
                }

                if (!result.UserId.HasValue) return Unauthorized(); 
                var user = await _userService.GetUserById(result.UserId.Value);
                return Ok(new { 
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

            var refreshToken = Request.Cookies["RefreshToken"];

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
            };
            if (_env.IsDevelopment())
            {
                cookieOptions.Secure = true;
                cookieOptions.SameSite = SameSiteMode.None;
            }
            else
            {
                cookieOptions.Secure = false;
                cookieOptions.SameSite = SameSiteMode.Lax;
            }

            Response.Cookies.Delete("RefreshToken", cookieOptions);
            return Ok(new { IsSuccess = true, Message = "Đăng xuất thành công" });
        }
    }
}