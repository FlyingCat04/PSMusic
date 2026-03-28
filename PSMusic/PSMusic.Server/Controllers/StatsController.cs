using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PSMusic.Server.Services.Interfaces;
using System.Security.Claims;

namespace PSMusic.Server.Controllers
{
    [Route("api/stats")]
    [ApiController]
    public class StatsController : ControllerBase
    {
        private readonly IActiveUserTracker _activeUserTracker;

        public StatsController(IActiveUserTracker activeUserTracker)
        {
            _activeUserTracker = activeUserTracker;
        }

        [HttpPost("heartbeat")]
        [Authorize]
        public IActionResult Heartbeat()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr)) return BadRequest(new { message = "UserId không hợp lệ" });

            _activeUserTracker.MarkActive(int.Parse(userIdStr));
            return Ok();
        }

        [HttpGet("active-users")]
        public IActionResult GetActiveUsers([FromQuery] int windowSeconds = 120)
        {
            if (windowSeconds <= 0) windowSeconds = 120;

            var count = _activeUserTracker.GetActiveUserCount(TimeSpan.FromSeconds(windowSeconds));
            return Ok(new
            {
                activeUsers = count,
                windowSeconds,
                timestamp = DateTime.UtcNow
            });
        }
    }
}
