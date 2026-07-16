using backend_csharp.Application.DTOs.Requests.Users;
using backend_csharp.Application.DTOs.Responses.Users;
using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
public class PersonController : ControllerBase
{
    public readonly IPersonService _personService;

    public PersonController(IPersonService personService)
    {
        _personService = personService;
    }


    [HttpPost]
    public async Task<ActionResult<PersonResponse>> Create([FromBody] CreatePersonRequest request)
    {
        if(request == null) return BadRequest("Request cannot be null");
        if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest("Name cannot be null or empty");
        if (request.Age <= 0 || request.Age > 150) return BadRequest("Age must be between 0 and 150");
        if (request.PlaygroundId == Guid.Empty) return BadRequest("PlaygroundId cannot be empty");
        if (request.CurrentUserId == Guid.Empty) return BadRequest("CurrentUserId cannot be empty");


        PersonResponse? result = await _personService.CreateAsync(request, request.PlaygroundId, request.CurrentUserId);
        return result != null ? Ok(result) : NotFound("Person could not be created");
    }


    [HttpGet("{personId:guid}/{currentUserId:guid}")]
    public async Task<ActionResult<PersonResponse>> GetById(Guid personId, Guid currentUserId)
    {
        if (personId == Guid.Empty) return BadRequest("Person ID cannot be empty");
        if (currentUserId == Guid.Empty) return BadRequest("Current user ID cannot be empty");

        PersonResponse? result = await _personService.GetByIdAsync(personId, currentUserId);
        return result != null ? Ok(result) : NotFound("Person not found");
    }

    [HttpGet("/all-by-playground/{playgroundId:guid}/{currentUserId:guid}")]
    public async Task<ActionResult<IEnumerable<PersonResponse>>> GetAllByPlayground(Guid playgroundId, Guid currentUserId)
    {
        if (playgroundId == Guid.Empty) return BadRequest("Playground ID cannot be empty");
        if (currentUserId == Guid.Empty) return BadRequest("Current user ID cannot be empty");

        var results = await _personService.GetAllByPlaygroundAsync(playgroundId, currentUserId);
        return results != null ? Ok(results) : NotFound("No people found for the given playground");
    }


    [HttpPut("{personId:guid}/{currentUserId:guid}")]
    public async Task<ActionResult<PersonResponse>> Update(Guid personId, Guid currentUserId, [FromBody] CreatePersonRequest request)
    {
        if (personId == Guid.Empty) return BadRequest("Person ID cannot be empty");
        if (currentUserId == Guid.Empty) return BadRequest("Current user ID cannot be empty");
        if (request == null) return BadRequest("Request cannot be null");
        if (string.IsNullOrWhiteSpace(request.Name)) return BadRequest("Name cannot be null or empty");
        if (request.Age <= 0 || request.Age > 150) return BadRequest("Age must be between 0 and 150");
        if (request.CurrentUserId == Guid.Empty) return BadRequest("Current user ID cannot be empty");

        PersonResponse? result = await _personService.UpdateAsync(personId, request, request.CurrentUserId);
        return result != null ? Ok(result) : NotFound("Person not found");
    }

    [HttpDelete("{personId:guid}/{currentUserId:guid}")]
    public async Task<ActionResult<PersonResponse>> Delete(Guid personId, Guid currentUserId)
    {
        if (personId == Guid.Empty) return BadRequest("Person ID cannot be empty");
        if (currentUserId == Guid.Empty) return BadRequest("Current user ID cannot be empty");

        PersonResponse? result = await _personService.DeleteAsync(personId, currentUserId);

        return result != null ? Ok(result) : NotFound("Person not found");
    }

}
