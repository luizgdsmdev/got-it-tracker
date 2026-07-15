using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.DTOs.Responses.Auth;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Application.Interfaces.Auth;

public interface IAuthService
{
    public Task<ActionResult<LoginResponse>> LoginAsync(CreateLoginRequest request);

    public Task<ActionResult<UserResponse>> RegisterAsync(CreateUserRequest request);

    public Task<ActionResult<LoginResponse>> RefreshTokenAsync(CreateAcessTokenRequest request);

    public Task<ActionResult> RevokeTokenAsync(Guid userId);
}
