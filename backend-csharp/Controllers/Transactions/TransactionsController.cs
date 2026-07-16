using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.Interfaces.Transactions;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.Transactions;

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
