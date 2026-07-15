using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests;

public record CreateLoginRequest(
    [Required(ErrorMessage = "A email is required for person"),
     EmailAddress(ErrorMessage = "Invalid email address format.")]
    string Email,

    [Required(ErrorMessage = "A password is required for login"),
     MinLength(8, ErrorMessage = "Password must be at least 8 characters long."),
     MaxLength(100, ErrorMessage = "Password must be at most 100 characters long."),
     RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$", ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.")]
    string Password
);