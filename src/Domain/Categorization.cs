namespace FinanceInzicht.Domain;

public enum CategorySource { Automatic, IbanRule, Manual }

public sealed class TransactionLabel
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public Guid BankTransactionId { get; init; }
    public required string Category { get; set; }
    public required string Subcategory { get; set; }
    public CategorySource Source { get; set; }
    public DateTimeOffset UpdatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class CounterpartyCategoryRule
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required string CounterpartyIban { get; init; }
    public required string Category { get; set; }
    public required string Subcategory { get; set; }
    public DateTimeOffset CreatedAtUtc { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
}
