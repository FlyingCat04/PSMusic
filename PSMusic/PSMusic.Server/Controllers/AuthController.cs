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

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        // POST api/auth/register
        [HttpPost("register")]
        [Authorize]
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
                    Secure = true,
                    SameSite = SameSiteMode.None
                };
                Response.Cookies.Append("AccessToken", result.Token, cookieOptions);
                return Ok(new { result.IsSuccess, result.Message });
            }
            else return BadRequest(new { result.IsSuccess, result.Message });
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
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None
            };
            Response.Cookies.Delete("AccessToken", cookieOptions);
            return Ok(new { IsSuccess = true, Message = "Đăng xuất thành công" });
        }
    }
}
