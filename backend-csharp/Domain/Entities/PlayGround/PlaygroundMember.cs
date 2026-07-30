using backend_csharp.Domain.Entities.Users;
using backend_csharp.Domain.Enums;

namespace backend_csharp.Domain.Entities.PlayGround;

public class PlaygroundMember
{
    public Guid PlaygroundId { get; set; }

    public Guid PersonId { get; set; }

    public bool IsAdmin { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;



    public PlaygroundRole Role { get; set; }

    public Playground Playground { get; set; } = null!;

    public Person? Person { get; set; } = null!;
}
