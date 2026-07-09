using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities;

public class PlaygroundMember
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    [Required(ErrorMessage = "PlaygroundId is required")]
    [ForeignKey("PlaygroundId")]
    public Guid PlaygroundId { get; set; }

    [Required(ErrorMessage = "PersonId is required")]
    [ForeignKey("PersonId")]
    public Guid PersonId { get; set; }

    [Required(ErrorMessage = "IsAdmin is required")]
    public bool IsAdmin { get; set; } = false;

    public Playground Playground { get; set; } = null!;
    public Person Person { get; set; } = null!;
}
