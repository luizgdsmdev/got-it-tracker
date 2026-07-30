using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.Interfaces.PlayGround;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpPost("{playgroundId:guid}")]
    public async Task<IActionResult> Create(Guid playgroundId, [FromBody] CreatePlaygroundMemberRequest request)
    {
        var member = await _playGroundMemberService.CreateAsync(playgroundId, request);

        return Ok(member);
    }



    [Authorize]
    [HttpGet("{playgroundId:guid}/{memberId:guid}")]
    public async Task<IActionResult> GetById(Guid playgroundId, Guid memberId)
    {
        var member = await _playGroundMemberService.GetByIdAsync(playgroundId, memberId);

        return Ok(member);
    }



    [Authorize]
    [HttpPost("{playgroundId:guid}/invite")]
    public async Task<IActionResult> Invite(Guid playgroundId, [FromBody] InviteUserRequest request)
    {
        await _playGroundMemberService.InviteUserAsync(playgroundId, request);

        return Ok();
    }



    [Authorize]
    [HttpPut("{playgroundId:guid}/{memberId:guid}")]
    public async Task<IActionResult> Update(Guid playgroundId, Guid memberId, [FromBody] UpdatePlaygroundMemberRequest request)
    {
        var member = await _playGroundMemberService.UpdateAsync(playgroundId, memberId, request);
        return Ok(member);
    }



    [Authorize]
    [HttpDelete("{playgroundId:guid}/{memberId:guid}")]
    public async Task<IActionResult> Delete(Guid playgroundId, Guid memberId)
    {
        var member = await _playGroundMemberService.DeleteAsync(playgroundId, memberId);
        return Ok(member);
    }


    [Authorize]
    [HttpGet("all-members/{playgroundId:guid}")]
    public async Task<IActionResult> GetAllMembers(Guid playgroundId)
    {
        var members = await _playGroundMemberService.GetAllByPlaygroundAsync(playgroundId);
        return Ok(members);
    }

}
