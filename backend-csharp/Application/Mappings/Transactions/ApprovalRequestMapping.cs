using backend_csharp.Application.DTOs.Responses.Transactions;
using backend_csharp.Domain.Entities.Transactions;

namespace backend_csharp.Application.Mappings.Transactions;

public class ApprovalRequestMapping
{

    public static ApprovalRequest ToEntity(Transaction transaction)
    {
        return new ApprovalRequest
        {
            PlaygroundId = transaction.PlaygroundId,
            PersonId = transaction.PersonId,
            RequestedById = transaction.PersonId,
            Description = transaction.Description,
            Amount = transaction.Amount,
            Type = transaction.Type,
            IsPublic = transaction.IsPublic
        };
    }

    public static ApprovalRequestResponse ToResponse(ApprovalRequest approvalRequest)
    {
        return new ApprovalRequestResponse(
            approvalRequest.Id,
            approvalRequest.PersonId,
            approvalRequest.Description ?? string.Empty,
            approvalRequest.Amount,
            approvalRequest.Type,
            approvalRequest.Status,
            approvalRequest.IsPublic,
            approvalRequest.RequestedAt ?? DateTime.MinValue,
            approvalRequest.ReviewedAt ?? DateTime.MinValue,
            approvalRequest.RequestedBy!,
            approvalRequest.ReviewedBy!,
            approvalRequest.ReasonDescription
        );
    }



    public static IEnumerable<ApprovalRequestResponse> ToResponse(IEnumerable<ApprovalRequest> approvalRequests)
    {
        return approvalRequests.Select(ToResponse);
    }


}
