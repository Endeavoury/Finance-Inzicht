namespace Oikonomis.Domain;

public enum UserRole { Administrator, User }

public sealed class ApplicationUser
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public required string Email { get; set; }
    public required string DisplayName { get; set; }
    public required string PasswordHash { get; set; }
    public UserRole Role { get; set; } = UserRole.User;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAtUtc { get; init; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAtUtc { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? LastLoginAtUtc { get; set; }
}