using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.PlayGround;

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
    public async Task<IActionResult> Create(Guid playgroundId, Guid currentUserId, [FromBody] CreatePlaygroundMemberRequest request)
    {
        if(request == null) return BadRequest("Request cannot be null");
        if (playgroundId == Guid.Empty) return BadRequest("playgroundId cannot be empty");
        if (currentUserId == Guid.Empty) return BadRequest("currentUserId cannot be empty");

        PlaygroundMemberResponse? member = await _playGroundMemberService.CreateAsync(playgroundId, currentUserId, request);
        
        return member != null ? Ok(member) : NotFound("Playground or User not found");
    }

    [HttpGet("{playgroundId:guid}/{memberId:guid}/{currentUserId:guid}")]
    public async Task<IActionResult> GetById(Guid playgroundId, Guid memberId, Guid currentUserId)
    {

        if (playgroundId == Guid.Empty) return BadRequest("playgroundId cannot be empty");
        if (memberId == Guid.Empty) return BadRequest("memberId cannot be empty");
        if (currentUserId == Guid.Empty) return BadRequest("currentUserId cannot be empty");

        PlaygroundMemberResponse? member = await _playGroundMemberService.GetByIdAsync(playgroundId, memberId, currentUserId);
        return member != null ? Ok(member) : NotFound("Member not found");
    }

}
