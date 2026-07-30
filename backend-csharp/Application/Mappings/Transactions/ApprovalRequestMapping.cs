using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.Mappings.Transactions;

public class ApprovalRequestMapping
{

    public static ApprovalRequest ToEntity(Transaction transaction, Guid currentUserId)
    {
        return new ApprovalRequest
        {
            PlaygroundId = transaction.PlaygroundId,
            PersonId = transaction.PersonId,
            TransactionId = transaction.Id,
            RequestedById = currentUserId,
            ReviewedBy = null,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Type = transaction.Type,
            IsPublic = transaction.IsPublic,
            Status = transaction.ApprovalStatus,
            RequestedAt = DateTime.UtcNow,
            ReviewedAt = null

        };
    }

    public static ApprovalRequestResponse ToResponse(ApprovalRequest approvalRequest)
    {
        return new ApprovalRequestResponse(
            approvalRequest.Id,
            approvalRequest.PersonId,
            approvalRequest.TransactionId,
            approvalRequest.PlaygroundId,
            approvalRequest.Description ?? string.Empty,
            approvalRequest.Amount,
            approvalRequest.Type,
            approvalRequest.Status,
            approvalRequest.IsPublic,
            approvalRequest.RequestedAt ?? DateTime.MinValue,
            approvalRequest.ReviewedAt ?? DateTime.MinValue,
            approvalRequest.RequestedById,
            approvalRequest.ReviewedById,
            approvalRequest.ReasonDescription
        );
    }



    public static IEnumerable<ApprovalRequestResponse> ToResponse(IEnumerable<ApprovalRequest> approvalRequests)
    {
        return approvalRequests.Select(ToResponse);
    }


}
