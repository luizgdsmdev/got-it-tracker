using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Application.Mappings.PlayGround;

public class PlayGroundMemberMapping
{
    /**
     * Maps a request to create a new PlaygroundMember to the corresponding entity.
     * @param playgroundId The ID of the playground.
     * @param personId The ID of the person.
     * @param IsAdmin A boolean indicating if the member is an admin.
     * @param role The role of the member in the playground.
     * @returns A new instance of PlaygroundMember.
     */
    public static PlaygroundMember ToPlaygroundMember(Guid playgroundId, Guid personId, bool IsAdmin, PlaygroundRole role)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return new PlaygroundMember
        {
            PlaygroundId = playgroundId,
            PersonId = personId,
            IsAdmin = IsAdmin,
            JoinedAt = DateTime.UtcNow,
            Role = role
        };
    }


    /**
     * Maps a request to create a new PlaygroundMember with owner privileges to the corresponding entity.
     * @param playgroundId The ID of the playground.
     * @param personId The ID of the person.
     * @param isAdmin A boolean indicating if the member is an admin.
     * @param role The role of the member in the playground.
     * @returns A new instance of PlaygroundMember with owner privileges.
     */
    public static PlaygroundMember ToPlaygroundOwnerMember(Guid playgroundId, Guid personId, bool isAdmin, PlaygroundRole role)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return new PlaygroundMember
        {
            PlaygroundId = playgroundId,
            PersonId = personId,
            IsAdmin = isAdmin,
            JoinedAt = DateTime.UtcNow,
            Role = role
        };
    }


    /**
     * Maps a PlaygroundMember entity to a PlaygroundMemberResponse DTO.
     * @param member The PlaygroundMember entity to be mapped.
     * @returns A new instance of PlaygroundMemberResponse containing the mapped data.
     */
    public static PlaygroundMemberResponse ToPlaygroundMemberResponse(PlaygroundMember member)
    {
        // PlaygroundMemberResponse is a positional record; use its primary constructor
        return new PlaygroundMemberResponse(
            member.PlaygroundId, 
            member.PersonId, 
            member.IsAdmin, 
            member.JoinedAt, 
            member.Role,

            member.Person?.UserId,
            member.Person!.Name,
            member.Person.Age
            );
    }


}