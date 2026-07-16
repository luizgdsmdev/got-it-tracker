using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;

namespace backend_csharp.Application.Interfaces.Transactions;

public interface ITransactionService
{
    Task<TransactionResponse> CreateDirectAsync(CreateTransactionRequest request, Guid currentUserId);
}
