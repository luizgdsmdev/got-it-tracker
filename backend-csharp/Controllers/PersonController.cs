using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.Interfaces;
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


    //[HttpPost]
    //public async Task<ActionResult> Create([FromBody] CreatePersonRequest request)
    //{
    //    var result = await _personService.CreateAsync(request);
    //    return Ok(result);
    //}
}
