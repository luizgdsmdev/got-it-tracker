using AutoMapper;
using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Domain.Entities;
using backend_csharp.Domain.Enums;
using backend_csharp.Infrastructure.Persistence.Interfaces;

namespace backend_csharp.Application.Services;

public class ApprovalRequestService : IApprovalRequestService
{
    private readonly IApprovalRequestRepository _requestRepo;
    private readonly ITransactionRepository _transactionRepo;
    private readonly IPlaygroundMemberRepository _memberRepo;
    private readonly IMapper _mapper;

    public ApprovalRequestService(
        IApprovalRequestRepository requestRepo,
        ITransactionRepository transactionRepo,
        IPlaygroundMemberRepository memberRepo,
        IMapper mapper)
    {
        _requestRepo = requestRepo;
        _transactionRepo = transactionRepo;
        _memberRepo = memberRepo;
        _mapper = mapper;
    }

    public async Task<ApprovalRequestResponse> CreateAsync(CreateApprovalRequest request, Guid currentUserId)
    {
        // Validates if if the user is a valid playground member
        //var isMember = await _memberRepo.GetByPlaygroundAndPersonAsync(request.PlaygroundId, request.PersonId);
        //if (isMember == null)
        //    throw new UnauthorizedAccessException("You are not a member of this playground.");

        //var approval = new ApprovalRequest
        //{
        //    PlaygroundId = request.PlaygroundId,
        //    PersonId = request.PersonId,
        //    RequestedById = currentUserId,
        //    Description = request.Description,
        //    Amount = request.Amount,
        //    Type = request.Type,
        //    IsPublic = request.IsPublic
        //};

        //await _requestRepo.AddAsync(approval);
        //return _mapper.Map<ApprovalRequestResponse>(approval);

        return null; // Placeholder return statement
    }

    public async Task<ApprovalRequestResponse> ApproveAsync(Guid requestId, Guid adminUserId)
    {
        var request = await _requestRepo.GetByIdAsync(requestId);
        //if (request == null) throw new NotFoundException("Request not found.");

        // TODO: Verify if user is playground admin
        request.Status = ApprovalStatus.Approved;
        request.ReviewedById = adminUserId;
        request.ReviewedAt = DateTime.UtcNow;

        await _requestRepo.UpdateAsync(request);

        // Create Transaction automatically
        var transaction = new Transaction
        {
            PlaygroundId = request.PlaygroundId,
            PersonId = request.PersonId,
            Description = request.Description,
            Amount = request.Amount,
            Type = request.Type,
            Date = DateTime.UtcNow
        };

        await _transactionRepo.AddAsync(transaction);

        return _mapper.Map<ApprovalRequestResponse>(request);
    }

    public async Task<ApprovalRequestResponse> RejectAsync(Guid requestId, Guid adminUserId, string rejectionReason)
    {
        var request = await _requestRepo.GetByIdAsync(requestId);
        //if (request == null) throw new NotFoundException("Request not found.");

        request.Status = ApprovalStatus.Rejected;
        request.RejectionReason = rejectionReason;
        request.ReviewedById = adminUserId;
        request.ReviewedAt = DateTime.UtcNow;

        await _requestRepo.UpdateAsync(request);

        return _mapper.Map<ApprovalRequestResponse>(request);
    }

    public Task<ApprovalRequestResponse> ApproveAsync(Guid requestId, Guid adminUserId, string? notes = null)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ApprovalRequestResponse>> GetPendingAsync(Guid playgroundId, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<ApprovalRequestResponse>> GetMyRequestsAsync(Guid userId)
    {
        throw new NotImplementedException();
    }
}
