using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;

namespace backend_csharp.Application.Interfaces;

public interface ITransactionService
{
    Task<TransactionResponse> CreateDirectAsync(CreateTransactionRequest request, Guid currentUserId);
}
