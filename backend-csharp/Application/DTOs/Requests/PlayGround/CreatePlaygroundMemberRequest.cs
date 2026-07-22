using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record CreatePlaygroundMemberRequest(
    [Required(ErrorMessage = "Name is required")]
    string Name,


    [Required(ErrorMessage = "Age is required")]
    int Age
);
