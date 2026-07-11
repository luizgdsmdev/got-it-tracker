using backend_csharp.Application.DTOs.Requests;
using backend_csharp.Application.DTOs.Responses;
using backend_csharp.Domain.Entities;

namespace backend_csharp.Application.Mappings;

public class PlayGroundMemberMapping
{

    public static PlaygroundMember ToPlaygroundMember(CreatePlaygroundMemberRequest request)
    {
        //Validations were made in the controller, so we can assume that the request is valid here.
        return new PlaygroundMember
        {
            PlaygroundId = request.playGroundId,
            PersonId = request.memberID,
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
        return new PlaygroundMemberResponse
        {
            Id = member.Id,
            PlaygroundId = member.PlaygroundId,
            PersonId = member.PersonId,
            IsAdmin = member.IsAdmin
        };
    }


}