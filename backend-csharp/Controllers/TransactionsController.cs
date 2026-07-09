using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers;

[ApiController]
[Route("api/transactions")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionRequest request)
    {
        var userId = Guid.NewGuid();
        var result = await _transactionService.CreateDirectAsync(request, userId);
        //return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        return Ok(result);
    }
}
