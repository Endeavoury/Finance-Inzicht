using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using FinanceInzicht.Domain;
using Microsoft.IdentityModel.Tokens;

public static class AuthenticationSupport
{
    private const int Iterations = 210000;
    public static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA512, 32);
        return $"v1.{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }
    public static bool VerifyPassword(string password, string stored)
    {
        var parts = stored.Split('.');
        if (parts.Length != 4 || parts[0] != "v1" || !int.TryParse(parts[1], out var iterations)) return false;
        try { return CryptographicOperations.FixedTimeEquals(Rfc2898DeriveBytes.Pbkdf2(password, Convert.FromBase64String(parts[2]), iterations, HashAlgorithmName.SHA512, 32), Convert.FromBase64String(parts[3])); }
        catch { return false; }
    }
    public static string Token(ApplicationUser user, IConfiguration configuration)
    {
        var key = configuration["Auth:JwtSigningKey"] ?? throw new InvalidOperationException("Auth:JwtSigningKey must be configured.");
        if (key.Length < 32) throw new InvalidOperationException("Auth:JwtSigningKey must be at least 32 characters.");
        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Email, user.Email), new Claim(ClaimTypes.Name, user.DisplayName), new Claim(ClaimTypes.Role, user.Role.ToString()) };
        return new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(configuration["Auth:Issuer"] ?? "finance-inzicht", configuration["Auth:Audience"] ?? "finance-inzicht-web", claims, expires: DateTime.UtcNow.AddHours(12), signingCredentials: credentials));
    }
    public static object PublicUser(ApplicationUser user) => new { id = user.Id, email = user.Email, displayName = user.DisplayName, role = user.Role.ToString(), isActive = user.IsActive, createdAtUtc = user.CreatedAtUtc, lastLoginAtUtc = user.LastLoginAtUtc };
    public static string? Validate(string? email, string? displayName, string? password)
    {
        if (string.IsNullOrWhiteSpace(email) || !email.Contains('@')) return "Enter a valid email address.";
        if (string.IsNullOrWhiteSpace(displayName) || displayName.Trim().Length > 100) return "Name is required and limited to 100 characters.";
        if (password is null || password.Length < 12) return "Password must be at least 12 characters.";
        return null;
    }
}
