using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.PlayGround;

[ApiController]
[Route("api/[controller]")]
public class PlaygroundsController : ControllerBase
{
    private readonly IPlaygroundService _playgroundService;

    public PlaygroundsController(IPlaygroundService playgroundService)
    {
        _playgroundService = playgroundService;
    }


    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PlaygroundResponse>> Create([FromBody] CreatePlaygroundRequest playgroundRequest)
    {
        var result = await _playgroundService.CreateAsync(playgroundRequest);

        return Ok(result);
    }

    [Authorize]
    [HttpGet("{playGroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> GetById([FromRoute] Guid playGroundId)
    {
        var result = await _playgroundService.GetByIdAsync(playGroundId);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<PlaygroundResponse?>>> GetByUser([FromRoute] Guid userId)
    {
        var result = await _playgroundService.GetByUserAsync(userId);
        return Ok(result);
    }

    [Authorize]
    [HttpPatch("/toggle-approval/{playgroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> ToggleAskForApproval([FromRoute] Guid playgroundId)
    {
        var result = await _playgroundService.ToggleAskForApprovalAsync(playgroundId);
        return Ok(result);
    }

    [Authorize]
    [HttpPut("{playgroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> Update([FromRoute] Guid playgroundId, [FromBody] CreatePlaygroundRequest request)
    {
        var result = await _playgroundService.UpdateAsync(playgroundId, request);
        return Ok(result);
    }

    [Authorize]
    [HttpDelete("{playgroundId:guid}")]
    public async Task<ActionResult> Delete([FromRoute] Guid playgroundId)
    {
        var result = await _playgroundService.DeleteAsync(playgroundId);
        return Ok(result); // Returns only a message such as "new OkObjectResult($"Playground with ID {playgroundId} deleted successfully");"
    }
}
