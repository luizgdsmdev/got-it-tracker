using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record UpdatePlaygroundMemberRequest(
    [Required(ErrorMessage = "Role is required")]
    PlaygroundRole Role,


    [Required(ErrorMessage = "IsAdmin is required")]
    bool IsAdmin);
