using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.Interfaces.Transactions;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.Transactions;

[ApiController]
[Route("api/approval-requests")]
public class ApprovalRequestsController : ControllerBase
{
    private readonly IApprovalRequestService _approvalService;

    public ApprovalRequestsController(IApprovalRequestService approvalService)
    {
        _approvalService = approvalService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateApprovalRequest request)
    {
        var userId = Guid.NewGuid(); // TODO: JWT
        var result = await _approvalService.CreateAsync(request, userId);
        //return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        return Ok();
    }

    [HttpPost("{id}/approve")]
    public async Task<IActionResult> Approve(Guid id)
    {
        var adminId = Guid.NewGuid(); // TODO: JWT
        var result = await _approvalService.ApproveAsync(id, adminId);
        return Ok(result);
    }

    [HttpPost("{id}/reject")]
    public async Task<IActionResult> Reject(Guid id, [FromBody] string reason)
    {
        var adminId = Guid.NewGuid();
        var result = await _approvalService.RejectAsync(id, adminId, reason);
        return Ok(result);
    }
}
