using System.ComponentModel.DataAnnotations;

namespace backend_csharp.Application.DTOs.Requests;

public record CreateAcessTokenRequest(
    [Required(ErrorMessage = "A acess token is required for acess"),
     MinLength(30, ErrorMessage = "Acess token must be at least 30 characters long."),
     MaxLength(2000, ErrorMessage = "Acess token must be at most 300 characters long.")]
    string AcessToken,


    [Required(ErrorMessage = "A refresh token is required for person"),
     MinLength(30, ErrorMessage = "Refresh token must be at least 30 characters long."),
     MaxLength(2000, ErrorMessage = "Refresh token must be at most 300 characters long.")]
    string RefreshToken
);
