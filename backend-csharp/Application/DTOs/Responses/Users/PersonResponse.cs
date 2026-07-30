namespace backend_csharp.Application.DTOs.Responses.Users;

public record PersonResponse(
    
    Guid Id, 
    
    string Name, 
    
    int Age);