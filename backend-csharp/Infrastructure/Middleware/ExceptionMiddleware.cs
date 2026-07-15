using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Domain.Exceptions;
using System.Text.Json;

namespace backend_csharp.Infrastructure.Middleware;

public class ExceptionMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (AppException ex)
        {
            context.Response.StatusCode = ex.StatusCode;
            context.Response.ContentType = "application/json";

            var response = ErrorResponse.FromException(
                                        ex,
                                        ex.StatusCode,
                                        context.TraceIdentifier);

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
        catch (Exception ex)
        {
            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";

            var response = ErrorResponse.FromException(
                                        ex,
                                        500,
                                        context.TraceIdentifier);

            await context.Response.WriteAsync(
                JsonSerializer.Serialize(response));
        }
    }
}
