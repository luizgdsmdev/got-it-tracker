using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name is required"),
         StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters"),
         MinLength(1, ErrorMessage = "Name cannot be empty")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Email is required"),
         StringLength(100, ErrorMessage = "Email cannot be longer than 100 characters"),
         MinLength(1, ErrorMessage = "Email cannot be empty"),
         EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }


        [Required(ErrorMessage = "Password is required"),
         StringLength(100, ErrorMessage = "Password cannot be longer than 100 characters"),
         MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "CreatedAt is required")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "UpdatedAt is required")]
        public DateTime LastUpdatedAt { get; set; }

        public ICollection<Playground> Playgrounds { get; set; } = [];

        public ICollection<ApprovalRequest> RequestedApprovals { get; set; } = [];

        public ICollection<ApprovalRequest> ReviewedApprovals { get; set; } = [];
    }
}
