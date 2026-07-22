using backend_csharp.Domain.Entities.Users;

namespace backend_csharp.Application.Mappings.Users;

public class PersonMapping
{
    // Used only for mapping a guest (non-user) to a Person entity
    /**
     * Maps a guest's name and age to a Person entity.
     *
     * @param name The name of the guest.
     * @param age The age of the guest.
     * @return A new Person entity with the provided name and age, and a null UserId.
     */
    public static Person ToGuestPerson(string name, int age)
    {
        return new Person
        {
            UserId = null,
            Name = name,
            Age = age
        };
    }

    // Used only for mapping a registered User to a Person entity
    /**
     * Maps a registered User to a Person entity.
     *
     * @param request The User object containing the user's details.
     * @return A new Person entity with the UserId, Name, and Age from the User object.
     */
    public static Person ToUserPerson(User user)
    {
        return new Person
        {
            UserId = user.Id,
            Name = user.Name!,
            Age = user.Age
        };
    }



}
