using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Domain.Entities;

namespace backend_csharp.Application.Mappings;

public static class PlayGroundMapping
{

    public static Playground ToPlayground(CreatePlaygroundRequest request)
    {
        //Basic validation for now
        if (request is null)
            throw new ArgumentNullException(nameof(request), "Request cannot be null");
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Name is required");
        if (string.IsNullOrWhiteSpace(request.OwnerId.ToString()))
            throw new ArgumentException("Owner ID is required");
        if (string.IsNullOrWhiteSpace(request.AskForApproval.ToString()))
            throw new ArgumentException("Ask for Approval is required");

        return new Playground
        {
            Name = request.Name,
            OwnerId = request.OwnerId,
            UserId = request.OwnerId,
            AskForApproval = request.AskForApproval
        };
    }

    public static PlaygroundResponse ToDtoResponse(Playground playground)
    {
        //Basic validation for now
        if (playground is null)
            throw new ArgumentNullException(nameof(playground), "Playground cannot be null");
        if(playground.Id == Guid.Empty)
            throw new ArgumentException("Playground ID is required");
        if (string.IsNullOrWhiteSpace(playground.Name))
            throw new ArgumentException("Name is required");
        if (playground.OwnerId == Guid.Empty)
            throw new ArgumentException("Owner ID is required");

        return new PlaygroundResponse(playground.Id, playground.OwnerId, playground.Name, playground.AskForApproval, playground.CreatedAt);
    }


    public static IEnumerable<PlaygroundResponse> ToDtoResponseList(IEnumerable<Playground> playgrounds)
    {
        if (playgrounds is null)
            throw new ArgumentNullException(nameof(playgrounds), "Playgrounds cannot be null");
        return playgrounds.Select(p =>
        {
            if (p is null)
                throw new ArgumentException("Playground cannot be null");
            if (p.Id == Guid.Empty)
                throw new ArgumentException("Playground ID is required");
            if (string.IsNullOrWhiteSpace(p.Name))
                throw new ArgumentException("Name is required");
            if (p.OwnerId == Guid.Empty)
                throw new ArgumentException("Owner ID is required");
            return new PlaygroundResponse(p.Id, p.OwnerId, p.Name, p.AskForApproval, p.CreatedAt);
        });
    }
}