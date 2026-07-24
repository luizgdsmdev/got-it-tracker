using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Application.Interfaces.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.Transactions;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ApprovalRequestsController : ControllerBase
{
    private readonly IApprovalRequestService _approvalRequestService;

    public ApprovalRequestsController(IApprovalRequestService approvalService)
    {
        _approvalRequestService = approvalService;
    }



    [Authorize]
    [HttpGet("playground/{playgroundId:guid}")]
    public async Task<ActionResult<IEnumerable<ApprovalRequestResponse>>> GetAllByPlayground(Guid playgroundId)
    {
        var requests = await _approvalRequestService.GetPendingByPlaygroundAsync(playgroundId);

        return Ok(requests);
    }



    [Authorize]
    [HttpGet("{approvalRequestId:guid}")]
    public async Task<ActionResult<ApprovalRequestResponse>> GetById(Guid approvalRequestId)
    {
        var request = await _approvalRequestService.GetByIdAsync(approvalRequestId);

        return Ok(request);
    }



    [Authorize]
    [HttpPut("{approvalRequestId:guid}/approve")]
    public async Task<ActionResult<ApprovalRequestResponse>> Approve(Guid approvalRequestId)
    {
        var request = await _approvalRequestService.ApproveAsync(approvalRequestId);

        return Ok(request);
    }



    [Authorize]
    [HttpPut("{approvalRequestId:guid}/reject")]
    public async Task<ActionResult<ApprovalRequestResponse>> Reject(Guid approvalRequestId)
    {
        var request = await _approvalRequestService.RejectAsync(approvalRequestId);

        return Ok(request);
    }
}
