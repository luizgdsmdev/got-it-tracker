using backend_csharp.Application.Interfaces.Users;
using System.Security.Claims;

namespace backend_csharp.Application.Services.Users;

public class CurrentUserService : ICurrentUserService
{

    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }


    /**
     * Gets the current user's ID from the JWT token in the HTTP context.
     *
     * @return The current user's ID as a Guid.
     * @throws UnauthorizedAccessException if the user is not authenticated or the claim is missing.
     */
    public Guid UserId
    {
        get
        {
            var claim = _httpContextAccessor.HttpContext?
                .User
                .FindFirstValue(ClaimTypes.NameIdentifier) ?? 
                throw new UnauthorizedAccessException("User not authenticated.");

            return Guid.Parse(claim);
        }
    }
}
