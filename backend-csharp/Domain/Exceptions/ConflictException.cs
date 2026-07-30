using System.Net;

namespace backend_csharp.Domain.Exceptions;

public class ConflictException(string message) : AppException(message, (int)HttpStatusCode.Conflict)
{
}
