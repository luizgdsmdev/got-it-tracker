using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses.Auth;
using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Application.Services.Auth;
using backend_csharp.Domain.Entities;
using backend_csharp.Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<LoginResponse>> LoginAsync([FromBody] CreateLoginRequest request)
    {
        var loginResponse = await _authService.LoginAsync(request);

        return loginResponse == null ? throw new UnauthorizedException("Invalid credentials for login action") : Ok(loginResponse);
    }

    [HttpPost]
    [Route("register")]
    public async Task<ActionResult<LoginResponse>> RegisterAsync([FromBody] CreateUserRequest request)
    {
        var registerResponse = await _authService.RegisterAsync(request);

        return registerResponse == null ? throw new UnauthorizedException("Invalid credentials for register action") : Ok(registerResponse);

    }

    [HttpPost]
    [Route("refresh-token")]
    [Authorize]
    public async Task<ActionResult<LoginResponse>> RefreshTokenAsync([FromBody] CreateAcessTokenRequest request)
    {
        var refreshResponse = await _authService.RefreshTokenAsync(request);
        return refreshResponse == null ? throw new UnauthorizedException("Invalid credentials for refresh token action") : Ok(refreshResponse);
    }


    [Authorize]
    [HttpPost]
    [Route("revoke/{userId}")]
    public async Task<ActionResult> RevokeTokenAsync([FromRoute] Guid userId)
    {
        var result = await _authService.RevokeTokenAsync(userId);
        return (ActionResult)(result ?? throw new UnauthorizedException("Invalid credentials for revoke token action"));
    }


}
