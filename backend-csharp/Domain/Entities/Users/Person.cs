using backend_csharp.Domain.Entities.PlayGround;
using backend_csharp.Domain.Entities.Transactions;
using backend_csharp.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend_csharp.Domain.Entities.Users;

public class Person
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public string Name { get; set; } = string.Empty;

    public int Age { get; set; }

    public User? User { get; set; }

    public ICollection<PlaygroundMember> PlaygroundMemberships = [];

    public ICollection<Transaction> Transactions = [];

    public ICollection<ApprovalRequest> ApprovalRequests = [];

}
