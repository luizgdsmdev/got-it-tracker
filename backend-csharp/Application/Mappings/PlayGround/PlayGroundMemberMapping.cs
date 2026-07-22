using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace backend_csharp.Application.Mappings.PlayGround;

public class PlayGroundMemberMapping
{

    public static PlaygroundMember ToPlaygroundMember(CreatePlaygroundMemberRequest request)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return new PlaygroundMember
        {
            //PlaygroundId = request.playGroundId,
            //PersonId = request.currentUserId,
            //IsAdmin = request.isAdmin
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
            Role = role
        };
    }

    public static PlaygroundMember ToPlaygroundMember(User user, Guid playgroundId)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return new PlaygroundMember
        {
            PlaygroundId = playgroundId,
            PersonId = user.Id,
            IsAdmin = true
        };
    }

    public static IEnumerable<PlaygroundMember> ToPlaygroundMembers(IEnumerable<CreatePlaygroundMemberRequest> requests)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return requests.Select(ToPlaygroundMember);
    }


    public static PlaygroundMemberResponse ToPlaygroundMemberResponse(PlaygroundMember member)
    {
        // PlaygroundMemberResponse is a positional record; use its primary constructor
        return new PlaygroundMemberResponse(member.PersonId, member.PlaygroundId, member.PersonId, member.IsAdmin);
    }


}