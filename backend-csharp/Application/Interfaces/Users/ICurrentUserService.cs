namespace backend_csharp.Application.Interfaces.Users;

// This service provides the current user's ID,
// which will be used for authorization and user-specific operations such as creating or updating a Person entity. 
// The implementation of this service will typically extract the user ID from the JWT token in the request context.
public interface ICurrentUserService
{
    Guid UserId { get; }
}
