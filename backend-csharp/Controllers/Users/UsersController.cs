using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Application.Interfaces.Users;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }


    //Create user asynchronously
    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create([FromBody] UpdateUserRequest request)
    {
        return await _userService.CreateAsync(request);
    }

    [HttpGet("{id:guid}", Name = "GetById")]
    public async Task<ActionResult<UserResponse?>> GetById(Guid id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user == null ? NotFound("User not fund") : Ok(user);
    }

    [HttpGet("email/{email}", Name = "GetByEmail")]
    public async Task<ActionResult<UserResponse?>> GetByEmail(string email)
    {
        var user = await _userService.GetByEmailAsync(email);
        return user == null ? NotFound("User not fund") : Ok(user);
    }


    [HttpPut("{id:guid}", Name = "UpdateById")]
    public async Task<ActionResult<UserResponse?>> UpdateById(Guid id, [FromBody] UpdateUserRequest user)
    {
        var updatedUser = await _userService.UpdateByIdAsync(id, user);
        return updatedUser == null ? NotFound("User not fund") : Ok(updatedUser);
    }

    [HttpDelete("{id:guid}", Name = "DeleteById")]
    public async Task<ActionResult<UserResponse?>> DeleteById(Guid id)
    {
        var deletedUser = await _userService.DeleteByIdAsync(id);
        return deletedUser == null ? NotFound() : Ok(deletedUser);
    }
}
