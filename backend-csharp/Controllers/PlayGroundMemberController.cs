using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayGroundMemberController : ControllerBase
{
    private readonly IPlayGroundMemberService _playGroundMemberService;


    public PlayGroundMemberController(IPlayGroundMemberService playGroundMemberService)
    {
        _playGroundMemberService = playGroundMemberService;
    }

    [HttpPost("{playgroundId:guid}/{currentUserId:guid}")]
    public async Task<IActionResult> Create([FromBody] CreatePlaygroundMemberRequest request)
    {
        if(request == null) return BadRequest("Request cannot be null");
        if (request.playGroundId == Guid.Empty) return BadRequest("playGroundId cannot be empty");
        if (request.currentUserId == Guid.Empty) return BadRequest("currentUserId cannot be empty");

        PlaygroundMemberResponse? member = await _playGroundMemberService.CreateAsync(request.playGroundId, request.currentUserId, request);
    }

}
