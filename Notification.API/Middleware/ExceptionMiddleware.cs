using Notification.Application.Exceptions;
using System;
using System.Text.Json;
namespace Notification.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                var statusCode = GetStatusCode(ex);
                var response = new
                {
                    title = GetTitle(ex),
                    status = statusCode,
                    detail = ex.Message,
                    errors = GetErrors(ex)
                };

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }

        private object GetErrors(Exception ex)
        {
            IEnumerable<string> errors = null;

            if (ex is ValidationException validationException)
            {
                errors = validationException.Errors.Where(e => e.Key.Length > 0)
                .SelectMany(x => x.Value)
                .Select(x => x).ToArray();
            }

            return errors;
        }

        private object GetTitle(Exception ex)=>ex switch
            {
                ApplicationException applicationException => applicationException.Message,
                _ => "Server Error"
            };

    private static int GetStatusCode(Exception ex) => ex switch
        {
            BadRequestException => StatusCodes.Status400BadRequest,
            NotFoundException => StatusCodes.Status404NotFound,
            ValidationException => StatusCodes.Status422UnprocessableEntity,
            _ => StatusCodes.Status500InternalServerError
        };
    }
}
