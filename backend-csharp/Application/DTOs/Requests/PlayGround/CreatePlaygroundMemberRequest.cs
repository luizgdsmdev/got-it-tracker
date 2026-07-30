using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.PlayGround;

public record CreatePlaygroundMemberRequest(
    [Required(ErrorMessage = "Name is required"),
    MaxLength(50, ErrorMessage = "Name cannot exceed 50 characters"),
    MinLength(2, ErrorMessage = "Name must be at least 2 characters long")
    ]
    string Name,


    [Required(ErrorMessage = "Age is required"),
    Range(0, 120, ErrorMessage = "Age must be between 0 and 120")
    ]
    int Age
);
