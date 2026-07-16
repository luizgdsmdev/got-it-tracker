using Microsoft.AspNetCore.Identity;

namespace backend_csharp.Domain.Entities.Auth;

public class ApplicationUser : IdentityUser
{
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}
