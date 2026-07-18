using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Transactions;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities.Users
{
    public class User : IdentityUser<Guid>
    {

        [Required(ErrorMessage = "A UserName is required for person"),
         MinLength(1, ErrorMessage = "UserName must be at least 1 characters long."),
         MaxLength(40, ErrorMessage = "UserName must be at most 40 characters long.")]
        public string? Name { get; set; }


        [Required(ErrorMessage = "Age is required"),
         Range(12, 150, ErrorMessage = "Age must be between 12 and 150.")]
        public int Age { get; set; }


        [Required(ErrorMessage = "CreatedAt is required")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;



        [Required(ErrorMessage = "UpdatedAt is required")]
        public DateTime LastUpdatedAt { get; set; }


        public string? RefreshToken { get; set; }


        public DateTime? RefreshTokenExpiryTime { get; set; }


        public Person? Person { get; set; }

        public ICollection<Playground> Playgrounds { get; set; } = [];

        public ICollection<ApprovalRequest> RequestedApprovals { get; set; } = [];

        public ICollection<ApprovalRequest> ReviewedApprovals { get; set; } = [];
    }
}
