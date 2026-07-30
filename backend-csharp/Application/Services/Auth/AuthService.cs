using backend_csharp.Application.DTOs.Requests.Auth;
using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Auth;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Application.Mappings.Users;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend_csharp.Application.Services.Auth;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;
    private readonly ICurrentUserService _currentUser;
    private readonly IPersonService _personService;

    public AuthService(
        UserManager<User> userManager, 
        ITokenService tokenService,
        ICurrentUserService currentUser,
        IPersonService personService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _configuration = configuration;
        _currentUser = currentUser;
        _personService = personService;
    }

    /**
     * This method handles the login process for a user.
     * It checks if the user exists, validates the password, generates JWT and refresh tokens, and updates the user's refresh token in the database.
     *
     * @param request The login request containing the user's email and password.
     * @return An ActionResult containing a LoginResponse with the access token, refresh token, and expiration time.
     * @throws ValidationException If the request body is null.
     * @throws UnauthorizedException If the user is not found or the password is invalid.
     */
    public async Task<ActionResult<LoginResponse>> LoginAsync(CreateLoginRequest request)
    {
        if (request == null) throw new ValidationException("Request body cannot be null");

        // Check if the user exists
        User user = await _userManager.FindByEmailAsync(request.Email) 
                   ?? throw new UnauthorizedException("User not found");


        // Check for valid password
        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid) throw new UnauthorizedException("Invalid password");


        // Finally, if user exists and password is valid, start the auth signature process to generate JWT token and refresh token
        var userRoles = await _userManager.GetRolesAsync(user);
        var authClaims = new List<Claim>
        {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.Name),
                new(ClaimTypes.Email, user.Email!),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };


        // Iterate through the user roles and add them as claims
        // Based in possible user profiles whithin the system, this will be used to authorize access to certain endpoints
        foreach (var role in userRoles) authClaims.Add(new Claim(ClaimTypes.Role, role));

        // Token generation process
        var token = _tokenService.GenerateAccessToken(authClaims, _configuration);
        var refreshToken = _tokenService.GenerateRefreshToken();

        _ = int.TryParse(_configuration["JWT:RefreshTokenValidityInMinutes"], out var RefreshTokenValidityInMinutes);

        // Populate the user entity with valid info
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddMinutes(RefreshTokenValidityInMinutes);


        // Update the user entity in the DB
        await _userManager.UpdateAsync(user);

        return UserMapping.ToLoginResponse(
                            user, 
                            new JwtSecurityTokenHandler().WriteToken(token), 
                            refreshToken, 
                            token.ValidTo);

    }


    /**
     * This method handles the registration process for a new user.
     * It checks if the email is already in use, creates a new user, and returns the created user's information.
     *
     * @param request The registration request containing the user's email, password, and other details.
     * @return An ActionResult containing a UserResponse with the created user's information.
     * @throws ValidationException If the request body is null or if there are errors during user creation.
     * @throws ConflictException If the email is already in use.
     */
    public async Task<ActionResult<UserResponse>> RegisterAsync(UpdateUserRequest request)
    {

        if (request == null) throw new ValidationException("Request body cannot be null");

        // Check if a user exists with this email
        if (await _userManager.FindByEmailAsync(request.Email) != null)
        {
            throw new ConflictException("This email is already in use");
        }


        // Mapping the request to a User entity
        User newUser = UserMapping.ToUser(request);

        var userResult = await _userManager.CreateAsync(newUser, request.Password);

        if(!userResult.Succeeded) throw new ValidationException(string.Join("Error when creating user: ", userResult.Errors.Select(e => e.Description)));


        // Creates a new person for the user if it doesn't exist, this is important for the system to work properly
        // Use the user info to create the person if it doesn't exist
        var person = await _personService.CreateForUserAsync(newUser) ??
                                       throw new PersistenceException("Failed to create person");



        // Only returns the new user, redirects to login (front-end) to get the access token and refresh token
        return UserMapping.ToDtoResponse(newUser);
    }

    /**
     * This method handles the process of refreshing an access token using a valid refresh token.
     * It validates the provided access token and refresh token, generates a new access token and refresh token, and updates the user's refresh token in the database.
     *
     * @param request The request containing the expired access token and the valid refresh token.
     * @return An ActionResult containing a LoginResponse with the new access token, new refresh token, and expiration time.
     * @throws ValidationException If the request body is null or if the tokens are invalid.
     * @throws UnauthorizedException If the user is not found or if the tokens are invalid or expired.
     */
    public async Task<ActionResult<LoginResponse>> RefreshTokenAsync(CreateAcessTokenRequest request)
    {
        // Validate the request body and tokens
        if (request == null) throw new ValidationException("Request body cannot be null");
        string accessToken = request.AcessToken ?? throw new ValidationException("Access token cannot be null");
        string refreshToken = request.RefreshToken ?? throw new ValidationException("Refresh token cannot be null");

        // Verify the access token and extract the principal (user identity) from it
        var userIdentity = _tokenService.GetPrincipalFromExpiredToken(accessToken, _configuration);
        if(userIdentity == null) throw new UnauthorizedException("Invalid access token/refresh token");

        // NameIdentifier here refers to the user Id
        string userId = userIdentity.FindFirst(ClaimTypes.NameIdentifier.ToString())?.Value
                           ?? throw new UnauthorizedException("Invalid access token/refresh token");

        var user = await _userManager.FindByIdAsync(userId.ToString())
                       ?? throw new UnauthorizedException("User not found");

        // Validate the refresh token and its expiry time related to the user
        if (user == null)
        {
            throw new UnauthorizedException("User not found");
        }

        if (user.RefreshToken != refreshToken)
        {
            throw new UnauthorizedException("Refresh token is invalid");
        }

        if (user.RefreshTokenExpiryTime <= DateTime.UtcNow)
        {
            throw new UnauthorizedException("Refresh token has expired");
        }

        // Generate a new access token and refresh token
        var newAccessToken = _tokenService.GenerateAccessToken(userIdentity.Claims, _configuration);
        user.RefreshToken = _tokenService.GenerateRefreshToken();


        // Update the user's refresh token in the database
        await _userManager.UpdateAsync(user);



        return UserMapping.ToLoginResponse(
            user,
            new JwtSecurityTokenHandler().WriteToken(newAccessToken),
            user.RefreshToken,
            newAccessToken.ValidTo);
    }


    /**
     * This method handles the process of revoking a user's refresh token.
     * It validates the provided user ID, sets the user's refresh token to null, and updates the user's information in the database.
     *
     * @param userId The ID of the user whose refresh token is to be revoked.
     * @return An IActionResult indicating the success of the operation.
     * @throws UnauthorizedException If the user is not found.
     */
    public async Task<ActionResult> RevokeTokenAsync(Guid userId)
    {
        // Basic validation for the userId
        User user = await _userManager.FindByIdAsync(userId.ToString())
                    ?? throw new UnauthorizedException("User not found");

        // Revoke the refresh token by setting it to null
        user.RefreshToken = null;

        await _userManager.UpdateAsync(user);

        return new OkObjectResult(new { message = "Refresh token revoked successfully." });
    }

    /**
     * This method handles the process of updating a user's information.
     * It validates the provided user ID and update request, then updates the user's information in the database.
     *
     * @param userId The ID of the user to be updated.
     * @param request The update request containing the new user information.
     * @return A LoginResponse with the updated user information.
     * @throws UnauthorizedException If the user is not found.
     * @throws ValidationException If the update request is null or invalid.
     */
    public async Task<ActionResult<LoginResponse>> UpdateUserAsync(UpdateUserRequest request)
    {
        if (request == null) throw new ValidationException("Request body cannot be null");


        // Current user service to get the current user id (reover from the JWT token)
        Guid currentUserId = _currentUser.UserId;

        // Check for user existence
        User user = await _userManager.FindByIdAsync(currentUserId.ToString())
                    ?? throw new UnauthorizedException("User not found");


        // Update the user's properties based on the request
        user.Name = request.Name ?? user.Name;
        user.Email = request.Email ?? user.Email;
        user.Age = request.Age != 0 ? request.Age : user.Age;
        user.LastUpdatedAt = DateTime.UtcNow;
        user.PasswordHash = request.Password != null ? _userManager.PasswordHasher.HashPassword(user, request.Password) : user.PasswordHash;

        if (request.Email != null)
        {
            user.UserName = request.Email ?? user.UserName;
        }

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new ValidationException(string.Join("Error when updating user: ", updateResult.Errors.Select(e => e.Description)));
        }

        //---------------------------------------------------
        // Update the Person entity in the DB
        var personFromService = await _personService.GetByUserIdAsync(currentUserId);

        // If the person does not exist, create a new one
        if (personFromService == null)
        {
            await _personService.CreateForUserAsync(user);
        }
        else
        {
            // If the person exists, update its properties
            await _personService.UpdateAsync(personFromService.Id, user.UserName!, user.Age);
        }
        

        // Return the updated user information
        return UserMapping.ToLoginResponse(
            user,
            null,
            null,
            DateTime.UtcNow);
    }


    /**
     * This method retrieves a user by their email address.
     * It checks if the user exists and returns the user entity.
     *
     * @param email The email address of the user to be retrieved.
     * @return The User entity corresponding to the provided email address.
     * @throws UnauthorizedException If the user is not found.
     */
    public async Task<User?> FindByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);

        return user;
    }
}
