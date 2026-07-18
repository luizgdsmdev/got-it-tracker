using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.Users;

public record CreatePersonRequest(
    [Required(ErrorMessage = "A name is required for person"),
     MinLength(1, ErrorMessage = "Name must be at least 1 characters long."),
     MaxLength(40, ErrorMessage = "Name must be at most 40 characters long.")]
    string Name,

    [Required(ErrorMessage = "Age is required"),
     Range(1, 150, ErrorMessage = "Age must be between 1 and 150.")]
    int Age,

    [Required(ErrorMessage = "PlaygroundId is required")]
    Guid PlaygroundId,

    [Required(ErrorMessage = "CurrentUserId is required")]
    Guid CurrentUserId);
