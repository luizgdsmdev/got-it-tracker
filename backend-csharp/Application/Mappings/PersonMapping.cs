using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Domain.Entities;

namespace backend_csharp.Application.Mappings;

public class PersonMapping
{
    public static Person ToPerson(CreatePersonRequest request)
    {
        //Basic validation for now
        if (request is null)
            throw new ArgumentNullException(nameof(request), "Request cannot be null");
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");
        if (request.Age is <= 0 or > 150)
            throw new ArgumentException("Age is required, must be between 1 and 150");
        return new Person
        {
            Name = request.Name,
            Age = request.Age
        };
    }

    public static Person ToPerson(User request)
    {
        //Basic validation for now
        if (request is null)
            throw new ArgumentNullException(nameof(request), "Request cannot be null");
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");
        if (request.Age is <= 0 or > 150)
            throw new ArgumentException("Age is required, must be between 1 and 150");
        return new Person
        {
            Name = request.Name,
            Age = request.Age
        };
    }


    public static PersonResponse ToDtoResponse(Person person)
    {
        //Basic validation for now
        if (person is null)
            throw new ArgumentNullException(nameof(person), "Person cannot be null");
        if (string.IsNullOrWhiteSpace(person.Name))
            throw new ArgumentException("Name is required");
        if (person.Age is <= 0 or > 150)
            throw new ArgumentException("Age is required, must be between 1 and 150");

        return new PersonResponse(person.Id, person.Name, person.Age);
    }
}
