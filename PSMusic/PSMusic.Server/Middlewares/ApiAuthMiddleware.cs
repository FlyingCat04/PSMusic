using System.Net;

namespace PSMusic.Server.Middlewares
{
    public class ApiAuthMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public ApiAuthMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var headerName = _configuration["ApiSecurity:HeaderName"] ?? "X-App-Service-Key";
            var secretValue = _configuration["ApiSecurity:SecretValue"];

            if (context.Request.Path.StartsWithSegments("/api"))
            {
                if (!context.Request.Headers.TryGetValue(headerName, out var extractedValue)
                    || extractedValue != secretValue)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new { message = "Unauthorized Access" });
                    return;
                }
            }

            await _next(context);
        }
    }
}