using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Models.DTO.Auth;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> Register([FromBody] CreateUserDTO user)
        {
            var result = await _authService.Register(user);
            if (result.IsSuccess) return Ok(result);
            else return BadRequest(result);
        }

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
                    SameSite = SameSiteMode.Strict
                };
                Response.Cookies.Append("AccessToken", result.Token, cookieOptions);
                return Ok(new { result.IsSuccess, result.Message });
            }
            else return BadRequest(new { result.IsSuccess, result.Message });
        }
    }
}