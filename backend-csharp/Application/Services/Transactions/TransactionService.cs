using AutoMapper;
using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Application.Interfaces.Transactions;
using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services.Transactions;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepo;
    private readonly IPlaygroundMemberRepository _memberRepo;
    private readonly IMapper _mapper;

    public async Task<TransactionResponse> CreateDirectAsync(CreateTransactionRequest request, Guid currentUserId)
    {
        // Verify permission: the user must be a member of the playground to create a transaction
        //var member = await _memberRepo.GetByPlaygroundAndPersonAsync(request.PlaygroundId, request.PersonId);

        //if (member == null)
        //    throw new UnauthorizedAccessException("You are not a member of this playground.");

        //var transaction = new Transaction
        //{
        //    PlaygroundId = request.PlaygroundId,
        //    PersonId = request.PersonId,
        //    Description = request.Description,
        //    Amount = request.Amount,
        //    Type = request.Type,
        //    Date = request.Date ?? DateTime.UtcNow
        //};

        //await _transactionRepo.AddAsync(transaction);
        //return _mapper.Map<TransactionResponse>(transaction);

        return null; // Placeholder return statement
    }
}
