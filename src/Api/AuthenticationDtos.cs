using FinanceInzicht.Domain;
public sealed record AuthInput(string? Email, string? DisplayName, string? Password, UserRole Role = UserRole.User);
public sealed record AuthLogin(string? Email, string? Password);
public sealed record UserUpdate(string? DisplayName, string? Password, UserRole? Role, bool? IsActive);