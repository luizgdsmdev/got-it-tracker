using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
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

    [HttpPost]
    public async Task<ActionResult<PlaygroundResponse>> Create([FromBody] CreatePlaygroundRequest playgroundRequest)
    {
        if(playgroundRequest is null) return BadRequest("Invalid playground request.");

        // TODO: get from JWT afterwards
        var result = await _playgroundService.CreateAsync(playgroundRequest);
        //return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        return Ok(result);
    }


    [HttpGet("{playGroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> GetById([FromRoute] Guid playGroundId)
    {
        var result = await _playgroundService.GetByIdAsync(playGroundId);
        return Ok(result);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<ActionResult<IEnumerable<PlaygroundResponse?>>> GetByUser([FromRoute] Guid userId)
    {
        var result = await _playgroundService.GetByUserAsync(userId);
        return Ok(result);
    }

    [HttpPatch("/toggle-approval{playgroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> ToggleAskForApproval([FromRoute] Guid playgroundId)
    {
        var result = await _playgroundService.ToggleAskForApprovalAsync(playgroundId);
        return Ok(result);
    }

    [HttpPut("{playgroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> Update([FromRoute] Guid playgroundId, [FromBody] CreatePlaygroundRequest request)
    {
        var result = await _playgroundService.UpdateAsync(playgroundId, request);
        return Ok(result);
    }


    [HttpDelete("{playgroundId:guid}")]
    public async Task<ActionResult<PlaygroundResponse>> Delete([FromRoute] Guid playgroundId)
    {
        var result = await _playgroundService.DeleteAsync(playgroundId);
        return Ok(result);
    }
}
