using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace backend_csharp.Controllers;

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
}
