using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.Users;

public record UpdateUserRequest(
    [MinLength(1, ErrorMessage = "Name must be at least 1 characters long."),
     MaxLength(40, ErrorMessage = "Name must be at most 40 characters long.")]
    string Name,

    [Range(0, 150, ErrorMessage = "Age must be between 0 and 150.")]
    int Age,

    [EmailAddress(ErrorMessage = "Invalid email address format."),
     RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email address format.")]
    string Email,

    [MinLength(8, ErrorMessage = "Password must be at least 8 characters long."),
     MaxLength(100, ErrorMessage = "Password must be at most 100 characters long."),
     RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
    string Password
);
