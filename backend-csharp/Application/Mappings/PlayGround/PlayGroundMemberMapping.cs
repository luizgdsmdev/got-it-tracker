using backend_csharp.Application.DTOs.Requests.PlayGround;
using backend_csharp.Application.DTOs.Responses.PlayGround;
using backend_csharp.Domain.Entities.PlayGround;

namespace backend_csharp.Application.Mappings.PlayGround;

public class PlayGroundMemberMapping
{

    public static PlaygroundMember ToPlaygroundMember(CreatePlaygroundMemberRequest request)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return new PlaygroundMember
        {
            PlaygroundId = request.playGroundId,
            PersonId = request.currentUserId,
            IsAdmin = request.isAdmin
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
        return new PlaygroundMemberResponse(member.Id, member.PlaygroundId, member.PersonId, member.IsAdmin);
    }


}