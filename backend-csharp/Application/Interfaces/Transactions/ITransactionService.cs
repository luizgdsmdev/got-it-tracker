using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.Interfaces.Transactions;

public interface ITransactionService
{
    Task<TransactionResponse> CreateAsync(Guid playgroundId, CreateTransactionRequest request);
    Task<TransactionResponse> GetByIdAsync(Guid playgroundId, Guid transactionId);
    Task<IEnumerable<TransactionResponse>> GetAllAsync(Guid playgroundId);
    Task<IEnumerable<TransactionResponse>> GetAllTransactionsAsync();
    Task<Transaction> DeleteAsync(Guid playgroundId, Guid transactionId);
    Task<TransactionResponse> UpdateAsync(Guid playgroundId, Guid transactionId, UpdateTransactionRequest request);
}
