using System.Net;
using System.Text.Json;
using BookCircle.Api.Exceptions;

namespace BookCircle.Api.Middleware;

public sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception while processing {Method} {Path}", context.Request.Method, context.Request.Path);

            var statusCode = exception switch
            {
                ApiException apiException => apiException.StatusCode,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = new
            {
                message = statusCode == (int)HttpStatusCode.InternalServerError
                    ? "An unexpected server error occurred."
                    : exception.Message,
                statusCode
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
