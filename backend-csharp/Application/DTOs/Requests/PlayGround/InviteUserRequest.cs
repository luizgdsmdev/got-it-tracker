using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record InviteUserRequest(

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress]
    string Email,

    [Required(ErrorMessage = "Role is required")]
    PlaygroundRole Role
);
