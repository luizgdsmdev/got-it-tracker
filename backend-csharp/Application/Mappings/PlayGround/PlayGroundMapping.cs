using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;

namespace backend_csharp.Application.Mappings.PlayGround;

public static class PlayGroundMapping
{
    // Used for playgruound creation, mapping from CreatePlaygroundRequest to Playground entity
    // Only one per time
    /**
     * Maps a CreatePlaygroundRequest to a Playground entity.
     *
     * @param request The CreatePlaygroundRequest to be mapped.
     * @param ownerId The ID of the owner of the playground.
     * @return A new Playground entity with properties set from the request.
     */
    public static Playground ToPlayground(CreatePlaygroundRequest request, Guid ownerId)
    {
        return new Playground
        {
            Name = request.Name,
            OwnerId = ownerId,
            Description = request.Description,
            AskForApproval = request.AskForApproval,
            UserId = ownerId,
        };
    }

    // Used for response on playground creation, mapping from Playground entity to PlaygroundResponse
    // SInce only one playground is created at a time, we can use this method to map the entity to the response
    /**
     * Maps a Playground entity to a PlaygroundResponse.
     *
     * @param playground The Playground entity to be mapped.
     * @return A new PlaygroundResponse with properties set from the playground entity.
     */
    public static PlaygroundResponse ToDtoResponse(Playground playground)
    {
        return new PlaygroundResponse(
            playground.Id, 
            playground.OwnerId,
            playground.Description,
            playground.Name, 
            playground.AskForApproval, 
            playground.CreatedAt);
    }

    // Used for response on playground retrieval, mapping from Playground entity to PlaygroundResponse
    // Since multiple playgrounds can be retrieved at once, we can use this method to map the entities to the responses
    /**
     * Maps a collection of Playground entities to a collection of PlaygroundResponse.
     *
     * @param playgrounds The collection of Playground entities to be mapped.
     * @return A collection of PlaygroundResponse with properties set from the playground entities.
     */
    public static IEnumerable<PlaygroundResponse> ToDtoResponseList(IEnumerable<Playground> playgrounds)
    {
        return playgrounds.Select(p =>
        {
            return new PlaygroundResponse(
                p.Id, 
                p.OwnerId, 
                p.Description,
                p.Name, 
                p.AskForApproval, 
                p.CreatedAt);
        });
    }
}