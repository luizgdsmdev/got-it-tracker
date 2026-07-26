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
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_csharp.Application.Services.Transactions;

public class ApprovalRequestService : IApprovalRequestService
{
    private readonly IPlaygroundAuthorizationService _authorizationService;
    private readonly IApprovalRequestRepository _approvalRepository;
    private readonly IPersonRepository _personRepository;
    private readonly ITransactionRepository _transactionRepo;
    private readonly ICurrentUserService _currentUser;
    private readonly ApplicationDbContext _context;

    public ApprovalRequestService(
        IPlaygroundAuthorizationService authorizationService,
        IApprovalRequestRepository approvalRepository,
        IPersonRepository personRepository,
        ITransactionRepository transactionRepo,
        ICurrentUserService currentUser,
        ApplicationDbContext context)
    {
        _authorizationService = authorizationService;
        _approvalRepository = approvalRepository;
        _personRepository = personRepository;
        _transactionRepo = transactionRepo;
        _currentUser = currentUser;
        _context = context;
    }


    /**
     * Creates an approval request for a transaction if it is needed.
     * 
     * @param transaction The transaction for which the approval request is to be created.
     * @returns The created approval request response.
     * @throws InvalidOperationException If the transaction is not pending approval.
     * @throws PersistenceException If the creation of the approval request fails.
     */
    public async Task<ApprovalRequestResponse?> CreateIfNeededAsync(Transaction transaction, Guid currentUserId)
    {

        // Since this is a transaction that requires approval, it can only be at pending status.
        // If it's not pending, we should not create an approval request.
        if (transaction.ApprovalStatus != ApprovalStatus.Pending) return null;

        // Mapping and creation/persistence of the approval
        ApprovalRequest request = ApprovalRequestMapping.ToEntity(transaction, currentUserId);

        ApprovalRequest createdRequest = await _approvalRepository.CreateAsync(request) ??
                                         throw new PersistenceException("Failed to create approval request.");


        return ApprovalRequestMapping.ToResponse(createdRequest);
    }


    /**
     * Retrieves an approval request by its ID.
     * 
     * @param id The ID of the approval request to retrieve.
     * @returns The approval request response.
     * @throws NotFoundException If the approval request is not found.
     * @throws UnauthorizedAccessException If the current user does not have permission to view the approval request.
     */
    public async Task<ApprovalRequestResponse> GetByIdAsync(Guid id)
    {
        // Only users with the appropriate permissions can approve transactions.
        // This is checked in the authorization service that checks the user's permissions.
        Guid currentUserId = _currentUser.UserId;

        // Check for existence
        var request = await _approvalRepository.GetByIdAsync(id) ?? 
                      throw new NotFoundException("Approval request not found.");

        // Recovers the person by using the currentUserId
        Person userPerson = await _personRepository.GetByUserIdAsync(currentUserId) ??
                        throw new ConflictException("Person not found for the current user.");

        // Check for permissions
        await _authorizationService.EnsureCanViewPlaygroundAsync(request.PlaygroundId, userPerson.Id);


        return ApprovalRequestMapping.ToResponse(request);
    }



    /**
     * Approves an approval request and updates the associated transaction's status to approved.
     * 
     * @param approvalRequestId The ID of the approval request to approve.
     * @returns The updated approval request response.
     * @throws NotFoundException If the approval request or associated transaction is not found.
     * @throws UnauthorizedAccessException If the current user does not have permission to approve the transaction.
     */
    public async Task<ApprovalRequestResponse> ApproveAsync(AcceptApprovalRequest requestApproval)
    {
        // Only users with the appropriate permissions can approve transactions.
        // This is checked in the authorization service that checks the user's permissions.
        Guid currentUserId = _currentUser.UserId;


        // CHekc for existence
        ApprovalRequest approval = await _approvalRepository.GetByIdAsync(requestApproval.ApprovalRequestId) ?? 
                                  throw new NotFoundException("Approval request not found.");

        if (approval.Status == ApprovalStatus.Approved)
        {
            throw new ConflictException("This approval request has already been approved.");
        }


        // Recovers the person by using the currentUserId
        Person userPerson = await _personRepository.GetByUserIdAsync(currentUserId) ??
                        throw new ConflictException("Person not found for the current user.");

        // Check for permissions
        await _authorizationService.EnsureCanApproveTransactionAsync(approval.PlaygroundId, userPerson.Id);

        // Recover the transaction associated with the approval request
        // Will be used to update the transaction status to approved after the approval request is approved.
        Transaction transaction = await _transactionRepo.GetByIdAsync(approval.PlaygroundId, approval.TransactionId) ?? 
                                  throw new NotFoundException("Transaction not found.");


        // Begin a database transaction to ensure atomicity of the approval process
        // Avoids potential issues where the approval request is approved but the transaction is not updated, or vice versa.
        await using var dbTransaction = await _context.Database.BeginTransactionAsync();

        // Update the approval request to approved
        approval.Status = ApprovalStatus.Approved;
        approval.ReviewedById = currentUserId;
        approval.ReviewedAt = DateTime.UtcNow;
        approval.ReasonDescription = requestApproval.ReasonDescription;

        // Update the transaction to approved
        transaction.ApprovalStatus = ApprovalStatus.Approved;

        try
        {
            await _approvalRepository.UpdateAsync(approval);
            await _transactionRepo.UpdateAsync(transaction);

            await dbTransaction.CommitAsync();
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            throw;
        }

        return ApprovalRequestMapping.ToResponse(approval);
    }


    /**
     * Rejects an approval request and updates the associated transaction's status to rejected.
     * 
     * @param approvalRequestId The ID of the approval request to reject.
     * @returns The updated approval request response.
     * @throws NotFoundException If the approval request or associated transaction is not found.
     * @throws UnauthorizedAccessException If the current user does not have permission to reject the transaction.
     */
    public async Task<ApprovalRequestResponse> RejectAsync(RejectApprovalRequest rejectRequest)
    {
        // Only users with the appropriate permissions can approve transactions.
        // This is checked in the authorization service that checks the user's permissions.
        Guid currentUserId = _currentUser.UserId;

        // Check for existence
        ApprovalRequest request = await _approvalRepository.GetByIdAsync(rejectRequest.RejectRequestId) ?? 
                                  throw new NotFoundException("Approval request not found.");

        if (request.Status == ApprovalStatus.Rejected)
        {
            throw new InvalidOperationException(
                "This approval request has already been rejected.");
        }

        // Recovers the person by using the currentUserId
        Person userPerson = await _personRepository.GetByUserIdAsync(currentUserId) ??
                        throw new ConflictException("Person not found for the current user.");


        // Check for permissions
        await _authorizationService.EnsureCanApproveTransactionAsync(request.PlaygroundId, userPerson.Id);

        // Recover the transaction associated with the approval request
        // Will be used to update the transaction status to approved after the approval request is approved.
        Transaction transaction = await _transactionRepo.GetByIdAsync(request.PlaygroundId, request.TransactionId) ?? 
                                  throw new NotFoundException("Transaction not found.");


        // Begin a database transaction to ensure atomicity of the approval process
        // Avoids potential issues where the approval request is approved but the transaction is not updated, or vice versa.
        await using var dbTransaction = await _context.Database.BeginTransactionAsync();

        // Update the approval request to rejected
        request.Status = ApprovalStatus.Rejected;
        request.ReviewedById = currentUserId;
        request.ReviewedAt = DateTime.UtcNow;
        request.ReasonDescription = rejectRequest.ReasonDescription;

        // Update the transaction to rejected
        transaction.ApprovalStatus = ApprovalStatus.Rejected;

        try
        {
            await _approvalRepository.UpdateAsync(request);
            await _transactionRepo.UpdateAsync(transaction);

            await dbTransaction.CommitAsync();
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            throw;
        }

        return ApprovalRequestMapping.ToResponse(request);
    }


    /**
     * Retrieves all pending approval requests for a specific playground.
     * 
     * @param playgroundId The ID of the playground for which to retrieve pending approval requests.
     * @returns A collection of pending approval request responses.
     * @throws UnauthorizedAccessException If the current user does not have permission to view the approval requests for the specified playground.
     */
    public async Task<IEnumerable<ApprovalRequestResponse>> GetPendingByPlaygroundAsync(Guid playgroundId)
    {
        // Only users with the appropriate permissions can approve transactions.
        // This is checked in the authorization service that checks the user's permissions.
        Guid currentUserId = _currentUser.UserId;

        // Recovers the person by using the currentUserId
        Person userPerson = await _personRepository.GetByUserIdAsync(currentUserId) ??
                        throw new ConflictException("Person not found for the current user.");

        // Check for permissions
        await _authorizationService.EnsureCanApproveTransactionAsync(playgroundId, userPerson.Id);

        // Retrieve all pending approval requests for the specified playground
        var requests = await _approvalRepository.GetPendingByPlaygroundAsync(playgroundId);

        return ApprovalRequestMapping.ToResponse(requests);
    }
}
