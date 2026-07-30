using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace backend_csharp.Application.DTOs.Requests.Transactions;

public record AcceptApprovalRequest(

    [Required(ErrorMessage = "Approval request ID is required.")]
    Guid ApprovalRequestId,

    string? ReasonDescription = null
    );
