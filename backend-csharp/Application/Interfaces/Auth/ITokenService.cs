using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend_csharp.Application.Interfaces.Auth;

public interface ITokenService
{
    JwtSecurityToken GenerateAccessToken(IEnumerable<Claim> claims, IConfiguration _configuration);

    string GenerateRefreshToken();

    ClaimsPrincipal GetPrincipalFromExpiredToken(string token, IConfiguration _configuration);

}
