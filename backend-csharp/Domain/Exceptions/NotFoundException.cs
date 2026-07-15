using System.Net;

namespace backend_csharp.Domain.Exceptions;

public class NotFoundException(string message) : AppException(message, (int)HttpStatusCode.NotFound)
{
}
