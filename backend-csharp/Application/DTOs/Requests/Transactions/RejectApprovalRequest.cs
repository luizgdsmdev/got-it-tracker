using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.Transactions;

public record RejectApprovalRequest(

    [Required(ErrorMessage = "Approval request ID is required.")]
    Guid RejectRequestId,

    string? ReasonDescription = null
    );
