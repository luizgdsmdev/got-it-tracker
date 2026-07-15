namespace backend_csharp.Application.DTOs.Responses;

public class ErrorResponse
{
    public int StatusCode { get; init; }

    public string Error { get; init; } = string.Empty;

    public string Message { get; init; } = string.Empty;

    public DateTime Timestamp { get; init; }

    public string? TraceId { get; init; }

    public static ErrorResponse FromException(
        Exception exception,
        int statusCode,
        string? traceId = null)
    {
        return new ErrorResponse
        {
            StatusCode = statusCode,
            Error = exception.GetType().Name.Replace("Exception", ""),
            Message = exception.Message,
            Timestamp = DateTime.UtcNow,
            TraceId = traceId
        };
    }
}