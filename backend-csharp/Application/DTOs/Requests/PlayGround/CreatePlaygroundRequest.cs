using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record CreatePlaygroundRequest(

    [Required(ErrorMessage = "Playground name is required."),
     StringLength(100, ErrorMessage = "Playground name cannot exceed 100 characters."),
     MinLength(3, ErrorMessage = "Playground name must be at least 3 characters long.")]
    string Name,

    [Required(ErrorMessage = "Playground description is required."),
     StringLength(400, ErrorMessage = "Playground description cannot exceed 400 characters."),]
    string Description,

    [Required(ErrorMessage = "Approval requirement is required.")]
    bool AskForApproval);