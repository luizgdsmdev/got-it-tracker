using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Application.Interfaces.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.Transactions;

[ApiController]
[Route("api/transactions")]
[Authorize]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }


    
    [HttpPost("playground/{playgroundId:guid}")]
    [Authorize]
    public async Task<ActionResult<TransactionResponse>> Create(Guid playgroundId, [FromBody] CreateTransactionRequest request)
    {
        var transaction = await _transactionService.CreateAsync(playgroundId, request);

        return CreatedAtAction(nameof(GetById),
            new {
                playgroundId,
                transactionId = transaction.Id

            }, transaction);
    }



    
    [HttpGet("playground/{playgroundId:guid}/{transactionId:guid}")]
    [Authorize]
    public async Task<ActionResult<TransactionResponse>> GetById(Guid playgroundId, Guid transactionId)
    {
        var transaction = await _transactionService.GetByIdAsync(playgroundId, transactionId);

        return Ok(transaction);
    }



    [HttpGet("playground/{playgroundId:guid}")]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAllByPlayground(Guid playgroundId)
    {
        var transactions = await _transactionService.GetAllAsync(playgroundId);

        return Ok(transactions);
    }



    [HttpGet("all/")]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAllByPerson()
    {
        var transactions = await _transactionService.GetAllTransactionsAsync();

        return Ok(transactions);
    }



    [HttpPut("playground/{playgroundId:guid}/{transactionId:guid}")]
    [Authorize]
    public async Task<ActionResult<TransactionResponse>> Update(Guid playgroundId, Guid transactionId, [FromBody] UpdateTransactionRequest request)
    {
        var transaction = await _transactionService.UpdateAsync(playgroundId, transactionId, request);

        return Ok(transaction);
    }



    [HttpDelete("playground/{playgroundId:guid}/{transactionId:guid}")]
    [Authorize]
    public async Task<ActionResult<TransactionResponse>> Delete(Guid playgroundId, Guid transactionId)
    {
        var transaction = await _transactionService.DeleteAsync(playgroundId, transactionId);

        return Ok(transaction);
    }
}
