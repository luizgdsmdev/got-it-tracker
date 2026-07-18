using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests.Users;

public record CreateUserRequest(
    [Required(ErrorMessage = "A name is required for person"),
     MinLength(1, ErrorMessage = "Name must be at least 1 characters long."),
     MaxLength(40, ErrorMessage = "Name must be at most 40 characters long.")]
    string Name,

    [Required(ErrorMessage = "Age is required"),
     Range(12, 150, ErrorMessage = "Age must be between 12 and 150.")]
    int Age,

    [Required(ErrorMessage = "A email is required for person"),
     EmailAddress(ErrorMessage = "Invalid email address format."),
     RegularExpression(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", ErrorMessage = "Invalid email address format.")]
    string Email,

    [Required(ErrorMessage = "A password is required for person"),
     MinLength(8, ErrorMessage = "Password must be at least 8 characters long."),
     MaxLength(100, ErrorMessage = "Password must be at most 100 characters long."),
     RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
    string Password
);
