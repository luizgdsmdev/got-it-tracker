using backend_csharp.Application.Interfaces.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace backend_csharp.Application.Services.Auth;

public class TokenService : ITokenService
{
    /**
     * Generates a JWT access token based on the provided claims and configuration.
     *
     * @param claims The claims to include in the token.
     * @param _configuration The configuration object containing JWT settings.
     * @return A JwtSecurityToken representing the generated access token.
     * @throws InvalidOperationException If the JWT secret is not configured.
     */
    public JwtSecurityToken GenerateAccessToken(IEnumerable<Claim> claims, IConfiguration _configuration)
    {
        var key = _configuration.GetSection("JWT").GetValue<string>("Secret") ?? 
                  throw new InvalidOperationException("JWT Secret is not configured.");

        var keyBytes = System.Text.Encoding.UTF8.GetBytes(key);

        var signingCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes),
                                 SecurityAlgorithms.HmacSha256Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(
                _configuration
                .GetSection("JWT")
                .GetValue<int>("TokenValidityInMinutes")), // Access token valid for 30 minutes, refresh token (RefreshTokenValidityInMinutes) will last 60 (vide appsettings.json)
            Issuer = _configuration.GetSection("JWT").GetValue<string>("ValidIssuer"),
            Audience = _configuration.GetSection("JWT").GetValue<string>("ValidAudience"),
            SigningCredentials = signingCredentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.CreateJwtSecurityToken(tokenDescriptor);
    }

    /**
     * Generates a secure random refresh token.
     *
     * @return A string representing the generated refresh token.
     */
    public string GenerateRefreshToken()
    {
        var randomByte = new byte[128];
        using var randomNum = RandomNumberGenerator.Create();

        randomNum.GetBytes(randomByte);

        return Convert.ToBase64String(randomByte);

    }

    /**
     * Retrieves the ClaimsPrincipal from an expired JWT token.
     *
     * @param token The expired JWT token.
     * @param _configuration The configuration object containing JWT settings.
     * @return A ClaimsPrincipal representing the claims extracted from the expired token.
     * @throws InvalidOperationException If the JWT secret is not configured.
     * @throws SecurityTokenArgumentException If the token format or algorithm is invalid.
     */
    public ClaimsPrincipal GetPrincipalFromExpiredToken(string token, IConfiguration _configuration)
    {
        var key = _configuration.GetSection("JWT").GetValue<string>("Secret") ??
                  throw new InvalidOperationException("JWT Secret is not configured.");

        // Define token parameters for validating the expired token. 
        // Set ValidateLifetime to false to allow retrieval of claims from an expired token.
        // No need to validate the audience and issuer for this operation, as we are only interested in extracting claims.
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateLifetime = false, // We need to get the principal from an expired token, therefore we don't validate the lifetime
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(key))
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler
                        .ValidateToken(
                        token, 
                        tokenValidationParameters, 
                        out SecurityToken securityToken);

        // Validate the token type to ensure it is a JWT token.
        // Validate the algorithm used to sign the token to ensure it matches the expected algorithm (HMAC SHA256).
        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
           !jwtSecurityToken.Header.Alg.Equals(
               SecurityAlgorithms.HmacSha256, 
               StringComparison.InvariantCultureIgnoreCase))
        {
            throw new SecurityTokenArgumentException("Process failed: Invalid token format or algorithm.");
        }

        return principal;
    }
}
