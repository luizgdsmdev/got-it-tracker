using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Services.PlayGround;
using backend_csharp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

    [Authorize]
    [HttpPost("{playgroundId:guid}")]
    public async Task<IActionResult> Create(Guid playgroundId, [FromBody] CreatePlaygroundMemberRequest request)
    {
        var member = await _playGroundMemberService.CreateAsync(playgroundId, request);

        return Ok(member);
    }


    [HttpGet("{playgroundId:guid}/{memberId:guid}")]
    public async Task<IActionResult> GetById(Guid playgroundId, Guid memberId)
    {
        var member = await _playGroundMemberService.GetByIdAsync(playgroundId, memberId);

        return Ok(member);
    }

}
