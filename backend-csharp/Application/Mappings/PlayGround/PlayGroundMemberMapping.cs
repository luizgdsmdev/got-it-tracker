using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace backend_csharp.Application.Mappings.PlayGround;

public class PlayGroundMemberMapping
{

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

    public static PlaygroundMemberResponse ToPlaygroundMemberResponse(PlaygroundMember member)
    {
        // PlaygroundMemberResponse is a positional record; use its primary constructor
        return new PlaygroundMemberResponse(
            member.PlaygroundId, 
            member.PersonId, 
            member.IsAdmin, 
            member.JoinedAt, 
            member.Role);
    }


}