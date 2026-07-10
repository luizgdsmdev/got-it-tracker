using AutoMapper;
using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Application.Interfaces;
using backend_csharp.Application.Mappings;
using backend_csharp.Domain.Entities;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using backend_csharp.Infrastructure.Persistence.Repositories;

namespace backend_csharp.Application.Services;

public class PersonService : IPersonService
{

    private readonly IPersonRepository _personRepository;
    private readonly IPlaygroundRepository _playgroundRepository;
    private readonly IMapper _mapper;

    public PersonService(
        IMapper mapper,
        IPersonRepository personRepository,
        IPlaygroundRepository playgroundRepository)
    {
        _mapper = mapper;
        _personRepository = personRepository;
        _playgroundRepository = playgroundRepository;
    }

    public async Task<PersonResponse?> CreateAsync(CreatePersonRequest request, Guid playgroundId, Guid currentUserId)
    {

        //A person can only be created if the playground exists and the current user is the owner of the playground
        Playground? playground = await _playgroundRepository.GetByIdAsync(playgroundId);
        if (playground == null) throw new InvalidOperationException("Playground not found");
        if(playground.OwnerId != currentUserId) throw new UnauthorizedAccessException("Only the owner of the playground can create a person");

        Person? person = PersonMapping.ToPerson(request);

        await _personRepository.CreateAsync(person);

        return PersonMapping.ToDtoResponse(person);
    }

    public async Task<PersonResponse?> DeleteAsync(Guid personId, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<PersonResponse>> GetAllByPlaygroundAsync(Guid playgroundId, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public async Task<PersonResponse?> GetByIdAsync(Guid personId, Guid currentUserId)
    {
        throw new NotImplementedException();
    }

    public async Task<PersonResponse?> UpdateAsync(Guid personId, CreatePersonRequest request, Guid currentUserId)
    {
        throw new NotImplementedException();
    }
}
