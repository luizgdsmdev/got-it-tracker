using System.Net;

namespace backend_csharp.Domain.Exceptions;

public class ValidationException(string message) : AppException(message, (int)HttpStatusCode.BadRequest)
{
}
