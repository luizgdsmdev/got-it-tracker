using backend_csharp.Application.DTOs.Requests.Transactions;
using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Application.Interfaces.Transactions;
using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Application.Mappings.Transactions;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using backend_csharp.Domain.Exceptions;
using backend_csharp.Domain.Extensions;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services.Transactions;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IPersonRepository _personRepository;
    private readonly IPlaygroundMemberRepository _memberRepository;
    private readonly IPlaygroundAuthorizationService _authorizationService;
    private readonly IApprovalRequestService _approvalRequestService;
    private readonly ICurrentUserService _currentUser;

    public TransactionService(
        ITransactionRepository transactionRepository,
        IPersonRepository personRepository,
        IPlaygroundMemberRepository memberRepository,
        IPlaygroundAuthorizationService authorizationService,
        IApprovalRequestService approvalRequestService,
        ICurrentUserService currentUser)
    {
        _transactionRepository = transactionRepository;
        _personRepository = personRepository;
        _memberRepository = memberRepository;
        _authorizationService = authorizationService;
        _approvalRequestService = approvalRequestService;
        _currentUser = currentUser;
    }


    /**
     * Determines the initial approval status of a transaction based on the playground's settings and the user's role.
     *
     * @param playground The playground in which the transaction is being created.
     * @param role The role of the user creating the transaction.
     * @return The initial approval status for the transaction.
     */
    private static ApprovalStatus GetInitialStatus(Playground playground, PlaygroundRole role)
    {
        // Check if the playground requires approval for transactions (if not, auto-approve)
        // Otherwise simply approve the transaction if the user has the right role
        if (!playground.AskForApproval) return ApprovalStatus.Approved;


        // Check if the user's role allows them to approve transactions, in this case 
        // we can set the transaction as approved, otherwise it will be pending approval
        return role.CanApproveTransactions() ? ApprovalStatus.Approved : ApprovalStatus.Pending;
    }


    /**
     * Creates a new transaction in the specified playground.
     *
     * @param playgroundId The ID of the playground where the transaction will be created.
     * @param request The request object containing the details of the transaction to be created.
     * @return A response object containing the details of the created transaction.
     * @throws NotFoundException If the person does not exist or does not belong to the playground.
     * @throws ValidationException If the person does not belong to the playground.
     * @throws PersistenceException If there is an error while creating the transaction in the repository.
     */
    public async Task<TransactionResponse> CreateAsync(Guid playgroundId, CreateTransactionRequest request)
    {
        // Ensure the current user is authorized to create a transaction in the specified playground
        // So we recover its id
        Guid currentUserId = _currentUser.UserId;

        // Check if the person exists
        Person person = await _personRepository.GetByIdAsync(request.PersonId) ?? 
                        throw new NotFoundException("Person not found.");


        // If the person.UserId is null, it means is a guest person (not a real user)
        // For this case, the responsability passes to the real user setting up the action
        // Meaning the current real user must have the permissions necessary to the action being
        // Made with the guest person entity

        PlaygroundMember membership;
        Person userPerson;

        if (person.UserId != null)
        {
            // Check for permission
            membership = await _authorizationService.EnsureCanCreateTransactionAsync(playgroundId, person.Id);
        }
        else
        {
            // Check if the UserPerson exists and belongs to the playground
            userPerson = await _personRepository.GetByUserIdAsync(currentUserId) ??
                            throw new NotFoundException("Person not found.");

            if (userPerson.Id != person.Id)
            {
                membership = await _authorizationService.EnsureCanCreateTransactionAsync(playgroundId, person.Id);
            }
            else
            {
                // Check for permission
                membership = await _authorizationService.EnsureCanCreateTransactionAsync(playgroundId, userPerson.Id);
            }
        }


        // Validates if the person is minor, in this case is prohibited to create income transactions,
        // Can only create expense transactions
        if (person.Age < 18 && request.Type == TransactionType.Income)
            throw new UnauthorizedException("Minors cannot create this type of transaction.");



        bool belongs = await _memberRepository.ExistsAsync(playgroundId, person.Id);
        if (!belongs) throw new ValidationException("Person does not belong to this playground.");



        // Check if the playground requires approval for transactions (if not, auto-approve)
        // The same is true for the user role, with auto-approval if the user has the right role
        // Otherwise, pending approval status is set for the transaction
        ApprovalStatus status = GetInitialStatus(membership.Playground, membership.Role);


        // Mapping and persistence
        Transaction transaction = TransactionMapping.ToEntity(playgroundId, request, status);

        Transaction createdTransaction = await _transactionRepository.CreateAsync(transaction) ?? 
                                         throw new PersistenceException("Failed to create transaction.");


        // If the transaction is pending approval, create an approval request for it
        await _approvalRequestService.CreateIfNeededAsync(createdTransaction, currentUserId);

        return TransactionMapping.ToResponse(createdTransaction);
    }


    /**
     * Retrieves a transaction by its ID within the specified playground.
     *
     * @param playgroundId The ID of the playground where the transaction is located.
     * @param transactionId The ID of the transaction to retrieve.
     * @return A response object containing the details of the retrieved transaction.
     * @throws NotFoundException If the transaction does not exist in the specified playground.
     */
    public async Task<TransactionResponse> GetByIdAsync(Guid playgroundId, Guid transactionId)
    {
        // Ensure the current user is authorized in the specified playground
        // So we recover its id, and Person Entity (that holds the permissions)
        Guid currentUserId = _currentUser.UserId;

        Person person = await _personRepository.GetByUserIdAsync(currentUserId) ??
                throw new NotFoundException("Person not found.");

        // Check for permission
        await _authorizationService.EnsureCanViewPlaygroundAsync(playgroundId, person.Id);

        // Recover the transaction from the repository
        Transaction transaction = await _transactionRepository.GetByIdAsync(playgroundId, transactionId) ?? 
                                  throw new NotFoundException("Transaction not found.");

        return TransactionMapping.ToResponse(transaction);
    }



    /**
     * Retrieves all transactions within the specified playground.
     *
     * @param playgroundId The ID of the playground for which to retrieve transactions.
     * @return A collection of response objects containing the details of the retrieved transactions.
     * @throws NotFoundException If no transactions are found for the specified playground.
     */
    public async Task<IEnumerable<TransactionResponse>> GetAllAsync(Guid playgroundId)
    {
        // Ensure the current user is authorized in the specified playground
        // So we recover its id, and Person Entity (that holds the permissions)
        Guid currentUserId = _currentUser.UserId;

        Person person = await _personRepository.GetByUserIdAsync(currentUserId) ??
                throw new NotFoundException("Person not found.");

        // Check for permission
        await _authorizationService.EnsureCanViewPlaygroundAsync(playgroundId, person.Id);

        // Retrieve all transactions for the specified playground
        var transactions = await _transactionRepository.GetByPlaygroundIdAsync(playgroundId) ??
                           throw new NotFoundException("No transactions found for this playground.");

        return TransactionMapping.ToResponse(transactions);
    }


    /**
     * Retrieves all transactions associated with the currently authenticated user.
     *
     * @return A collection of response objects containing the details of the retrieved transactions.
     * @throws NotFoundException If no person is found for the current user.
     */
    public async Task<IEnumerable<TransactionResponse>> GetAllTransactionsAsync()
    {
        // Ensure the current user is authorized in the specified playground
        // So we recover its id, and Person Entity (that holds the permissions)
        Guid currentUserId = _currentUser.UserId;

        Person person = await _personRepository.GetByUserIdAsync(currentUserId) ??
                throw new NotFoundException("Person not found.");

        // Recover all transactions from this person
        IEnumerable<Transaction> transactions = await _transactionRepository.GetByPersonIdAsync(person.Id);

        return TransactionMapping.ToResponse(transactions);
    }



    /**
     * Updates an existing transaction in the specified playground.
     *
     * @param playgroundId The ID of the playground where the transaction is located.
     * @param transactionId The ID of the transaction to update.
     * @param request The request object containing the updated details of the transaction.
     * @return A response object containing the details of the updated transaction.
     * @throws NotFoundException If the transaction does not exist in the specified playground.
     * @throws ValidationException If the transaction is already approved and cannot be edited.
     */
    public async Task<TransactionResponse> UpdateAsync(Guid playgroundId, Guid transactionId, UpdateTransactionRequest request)
    {
        // Ensure the current user is authorized in the specified playground
        // So we recover its id, and Person Entity (that holds the permissions)
        Guid currentUserId = _currentUser.UserId;

        Person person = await _personRepository.GetByUserIdAsync(currentUserId) ??
                throw new NotFoundException("Person not found.");

        // Check for permission
        await _authorizationService.EnsureCanCreateTransactionAsync(playgroundId, person.Id);

        // Recover the transaction from the repository and validates is ApprovalStatus
        Transaction transaction = await _transactionRepository.GetByIdAsync(playgroundId, transactionId)
                                        ?? throw new NotFoundException("Transaction not found.");

        // Update the transaction properties and persist the changes
        transaction.Description = request.Description;
        transaction.Amount = request.Amount;
        transaction.Type = request.Type;
        transaction.CreatedAt = request.TransactionDate; // Set in case a transaction is set to another date, eg.: next month, in this case does not affect dashboard

        await _transactionRepository.UpdateAsync(transaction);

        return TransactionMapping.ToResponse(transaction);
    }



    /**
     * Deletes a transaction from the specified playground.
     *
     * @param playgroundId The ID of the playground where the transaction is located.
     * @param transactionId The ID of the transaction to delete.
     * @throws NotFoundException If the transaction does not exist in the specified playground.
     * @return The deleted transaction.
     */
    public async Task<Transaction> DeleteAsync(Guid playgroundId, Guid transactionId)
    {
        // Ensure the current user is authorized in the specified playground
        // So we recover its id, and Person Entity (that holds the permissions)
        Guid currentUserId = _currentUser.UserId;

        Person person = await _personRepository.GetByUserIdAsync(currentUserId) ??
                throw new NotFoundException("Person not found.");

        // Check for permission
        await _authorizationService.EnsureCanManagePlaygroundAsync(playgroundId, person.Id);

        Transaction transaction = await _transactionRepository.GetByIdAsync(playgroundId, transactionId) ?? 
                                  throw new NotFoundException("Transaction not found.");

        await _transactionRepository.DeleteByIdAsync(playgroundId, transactionId);

        return transaction;
    }

}
