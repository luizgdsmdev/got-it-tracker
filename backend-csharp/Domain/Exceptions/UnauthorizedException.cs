using System.Net;

namespace backend_csharp.Domain.Exceptions;

public class UnauthorizedException(string message) : AppException(message, (int)HttpStatusCode.Unauthorized)
{
}
