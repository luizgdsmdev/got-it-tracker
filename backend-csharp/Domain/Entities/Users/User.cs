using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Transactions;
using Microsoft.AspNetCore.Identity;

namespace backend_csharp.Domain.Entities.Users
{
    public class User : IdentityUser<Guid>
    {
        public string? Name { get; set; }

        public int Age { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastUpdatedAt { get; set; }


        public string? RefreshToken { get; set; }


        public DateTime? RefreshTokenExpiryTime { get; set; }


        public Person? Person { get; set; }

        public ICollection<Playground> Playgrounds { get; set; } = [];

        public ICollection<ApprovalRequest> RequestedApprovals { get; set; } = [];

        public ICollection<ApprovalRequest> ReviewedApprovals { get; set; } = [];
    }
}
