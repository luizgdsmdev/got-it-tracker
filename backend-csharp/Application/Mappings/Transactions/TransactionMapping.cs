using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.Mappings.Transactions;

public static class TransactionMapping
{

    public static Transaction ToEntity(Guid playgroundId, CreateTransactionRequest request, ApprovalStatus status)
    {
        return new Transaction
        {
            PlaygroundId = playgroundId,
            PersonId = request.PersonId,
            Description = request.Description,
            Amount = request.Amount,
            Type = request.Type,
            IsPublic = request.IsPublic,
            ApprovalStatus = status,
            CreatedAt = DateTime.UtcNow
        };
    }

    

    public static TransactionResponse ToResponse(Transaction transaction)
    {
        return new TransactionResponse(
            transaction.Id,
            transaction.PlaygroundId,
            transaction.PersonId,
            transaction.Description,
            transaction.Amount,
            transaction.Type,
            transaction.IsPublic,
            transaction.ApprovalStatus,
            transaction.CreatedAt
        );
    }


    public static IEnumerable<TransactionResponse> ToResponse(IEnumerable<Transaction> transactions)
    {
        return transactions.Select(ToResponse);
    }
}
