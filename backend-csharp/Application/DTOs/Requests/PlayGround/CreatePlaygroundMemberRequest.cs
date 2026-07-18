using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record CreatePlaygroundMemberRequest(
    [Required(ErrorMessage = "PlaygroundId is required")]
    Guid PlayGroundId,

    [Required(ErrorMessage = "CurrentUserId is required")]
    Guid CurrentUserId,



    [Required(ErrorMessage = "IsAdmin is required")]
    bool IsAdmin);
