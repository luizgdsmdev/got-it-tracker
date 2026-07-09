using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers;

[ApiController]
[Route("api/playgrounds")]
public class PlaygroundsController : ControllerBase
{
    private readonly IPlaygroundService _playgroundService;

    public PlaygroundsController(IPlaygroundService playgroundService)
    {
        _playgroundService = playgroundService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePlaygroundRequest request)
    {
        var userId = Guid.NewGuid(); // TODO: get from JWT afterwards
        var result = await _playgroundService.CreateAsync(request, userId);
        //return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        return Ok(result);
    }
}
