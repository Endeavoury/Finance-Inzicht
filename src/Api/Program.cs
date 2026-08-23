using System.IO.Compression;using System.Security.Cryptography;using System.Security.Claims;using System.Text;using Microsoft.AspNetCore.Authentication.JwtBearer;using Microsoft.IdentityModel.Tokens;using FinanceInzicht.Application;using FinanceInzicht.Domain;using FinanceInzicht.Infrastructure;using Microsoft.AspNetCore.Http.Features;using Microsoft.EntityFrameworkCore;
var b=WebApplication.CreateBuilder(args);var jwtKey=b.Configuration["Auth:JwtSigningKey"] ?? throw new InvalidOperationException("Auth:JwtSigningKey must be configured.");if(jwtKey.Length<32)throw new InvalidOperationException("Auth:JwtSigningKey must be at least 32 characters.");b.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(o=>{o.TokenValidationParameters=new TokenValidationParameters{ValidateIssuerSigningKey=true,IssuerSigningKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),ValidateIssuer=true,ValidIssuer=b.Configuration["Auth:Issuer"]??"finance-inzicht",ValidateAudience=true,ValidAudience=b.Configuration["Auth:Audience"]??"finance-inzicht-web",ValidateLifetime=true,ClockSkew=TimeSpan.FromMinutes(1)};});b.Services.AddAuthorization();b.Services.AddInfrastructure(b.Configuration);b.Services.AddOpenApi();b.Services.AddSwaggerGen();b.Services.AddProblemDetails();b.WebHost.ConfigureKestrel(o=>o.Limits.MaxRequestBodySize=2L*1024*1024*1024);b.Services.Configure<FormOptions>(o=>o.MultipartBodyLengthLimit=2L*1024*1024*1024);var app=b.Build();app.UseExceptionHandler();app.Use(async(ctx,next)=>{var id=ctx.Request.Headers["X-Correlation-ID"].FirstOrDefault()??Guid.NewGuid().ToString("n");ctx.Response.Headers["X-Correlation-ID"]=id;using(app.Logger.BeginScope(new Dictionary<string,object>{{"CorrelationId",id}}))await next();});app.UseSwagger();app.UseSwaggerUI();app.UseAuthentication();app.UseAuthorization();
app.MapGet("/health/live",()=>Results.Ok(new{status="live"}));app.MapGet("/health/ready",async(AppDbContext db,IObjectStorage storage,CancellationToken ct)=>{await db.Database.CanConnectAsync(ct);return await storage.ExistsAsync(".health",ct)?Results.Ok(new{status="ready"}):Results.Ok(new{status="ready",storage="reachable"});});
var auth=app.MapGroup("/api/v1/auth").AllowAnonymous();
auth.MapGet("/setup-required",async(AppDbContext db,CancellationToken ct)=>Results.Ok(new{setupRequired=!await db.ApplicationUsers.AnyAsync(x=>x.IsActive,ct)}));
auth.MapPost("/bootstrap",async(AuthInput input,AppDbContext db,IConfiguration configuration,CancellationToken ct)=>{if(await db.ApplicationUsers.AnyAsync(ct))return Results.Conflict(new{error="An administrator already exists."});var error=AuthenticationSupport.Validate(input.Email,input.DisplayName,input.Password);if(error is not null)return Results.BadRequest(new{error});var user=new ApplicationUser{Email=input.Email!.Trim().ToLowerInvariant(),DisplayName=input.DisplayName!.Trim(),PasswordHash=AuthenticationSupport.HashPassword(input.Password!),Role=UserRole.Administrator};db.Add(user);await db.SaveChangesAsync(ct);return Results.Ok(new{token=AuthenticationSupport.Token(user,configuration),user=AuthenticationSupport.PublicUser(user)});});
auth.MapPost("/login",async(AuthLogin input,AppDbContext db,IConfiguration configuration,CancellationToken ct)=>{var email=input.Email?.Trim().ToLowerInvariant();var user=string.IsNullOrWhiteSpace(email)?null:await db.ApplicationUsers.SingleOrDefaultAsync(x=>x.Email==email,ct);if(user is null||!user.IsActive||!AuthenticationSupport.VerifyPassword(input.Password??string.Empty,user.PasswordHash))return Results.Unauthorized();user.LastLoginAtUtc=DateTimeOffset.UtcNow;await db.SaveChangesAsync(ct);return Results.Ok(new{token=AuthenticationSupport.Token(user,configuration),user=AuthenticationSupport.PublicUser(user)});});
var api=app.MapGroup("/api/v1").RequireAuthorization();
api.MapGet("/auth/me",async(ClaimsPrincipal principal,AppDbContext db,CancellationToken ct)=>{var id=Guid.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier),out var parsed)?parsed:Guid.Empty;var user=await db.ApplicationUsers.FindAsync([id],ct);return user is null||!user.IsActive?Results.Unauthorized():Results.Ok(AuthenticationSupport.PublicUser(user));});
var admin=api.MapGroup("/admin").RequireAuthorization(p=>p.RequireRole(UserRole.Administrator.ToString()));
admin.MapGet("/users",async(AppDbContext db,CancellationToken ct)=>Results.Ok((await db.ApplicationUsers.AsNoTracking().OrderBy(x=>x.Email).ToListAsync(ct)).Select(AuthenticationSupport.PublicUser)));
admin.MapPost("/users",async(AuthInput input,AppDbContext db,CancellationToken ct)=>{var error=AuthenticationSupport.Validate(input.Email,input.DisplayName,input.Password);if(error is not null)return Results.BadRequest(new{error});var email=input.Email!.Trim().ToLowerInvariant();if(await db.ApplicationUsers.AnyAsync(x=>x.Email==email,ct))return Results.Conflict(new{error="Email address already exists."});var user=new ApplicationUser{Email=email,DisplayName=input.DisplayName!.Trim(),PasswordHash=AuthenticationSupport.HashPassword(input.Password!),Role=input.Role==UserRole.Administrator?UserRole.Administrator:UserRole.User};db.Add(user);await db.SaveChangesAsync(ct);return Results.Created($"/api/v1/admin/users/{user.Id}",AuthenticationSupport.PublicUser(user));});
admin.MapPut("/users/{id:guid}",async(Guid id,UserUpdate input,ClaimsPrincipal principal,AppDbContext db,CancellationToken ct)=>{var user=await db.ApplicationUsers.FindAsync([id],ct);if(user is null)return Results.NotFound();if(!string.IsNullOrWhiteSpace(input.DisplayName)){if(input.DisplayName!.Trim().Length>100)return Results.BadRequest(new{error="Name is limited to 100 characters."});user.DisplayName=input.DisplayName!.Trim();}if(input.Password is not null){if(input.Password.Length<12)return Results.BadRequest(new{error="Password must be at least 12 characters."});user.PasswordHash=AuthenticationSupport.HashPassword(input.Password!);}if(input.Role.HasValue&&input.Role.Value!=user.Role){if(user.Role==UserRole.Administrator&&input.Role.Value!=UserRole.Administrator&&await db.ApplicationUsers.CountAsync(x=>x.Role==UserRole.Administrator&&x.IsActive,ct)<=1)return Results.Conflict(new{error="At least one active administrator is required."});user.Role=input.Role.Value;}if(input.IsActive.HasValue&&input.IsActive.Value!=user.IsActive){if(user.Role==UserRole.Administrator&&!input.IsActive.Value&&await db.ApplicationUsers.CountAsync(x=>x.Role==UserRole.Administrator&&x.IsActive,ct)<=1)return Results.Conflict(new{error="At least one active administrator is required."});user.IsActive=input.IsActive.Value;}user.UpdatedAtUtc=DateTimeOffset.UtcNow;await db.SaveChangesAsync(ct);return Results.Ok(AuthenticationSupport.PublicUser(user));});
api.MapPost("/imports",async(IFormFile file,AppDbContext db,IObjectStorage storage,CancellationToken ct)=>{if(file.Length==0)return Results.BadRequest(new{error="Empty upload."});var ext=Path.GetExtension(Path.GetFileName(file.FileName)).ToLowerInvariant();if(ext is not(".xml" or ".zip"))return Results.BadRequest(new{error="Only .xml and .zip are accepted."});var results=new List<object>();if(ext==".xml"){if(file.Length>50*1024*1024)return Results.BadRequest(new{error="XML exceeds 50 MiB."});await using var s=file.OpenReadStream();results.Add(await Save(s,Path.GetFileName(file.FileName),db,storage,ct));}else{if(file.Length>2L*1024*1024*1024)return Results.BadRequest(new{error="ZIP exceeds 2 GiB."});await using var zipStream=file.OpenReadStream();using var zip=new ZipArchive(zipStream,ZipArchiveMode.Read);var files=zip.Entries.Count(x=>!string.IsNullOrEmpty(x.Name));if(files>10000)return Results.BadRequest(new{error="ZIP has more than 10,000 files."});long total=0;foreach(var entry in zip.Entries){if(string.IsNullOrEmpty(entry.Name))continue;if(Path.GetExtension(entry.Name).ToLowerInvariant()!=".xml")return Results.BadRequest(new{error=$"ZIP entry is not XML: {entry.FullName}"});if(entry.Length>50*1024*1024||entry.CompressedLength>0&&entry.Length/entry.CompressedLength>100)return Results.BadRequest(new{error=$"Unsafe ZIP entry: {entry.FullName}"});total+=entry.Length;if(total>10L*1024*1024*1024)return Results.BadRequest(new{error="Uncompressed ZIP exceeds 10 GiB."});await using var es=entry.Open();results.Add(await Save(es,Path.GetFileName(entry.Name),db,storage,ct));}}return Results.Accepted(value:new{count=results.Count,imports=results});}).DisableAntiforgery();
api.MapGet("/imports",async(AppDbContext db,CancellationToken ct)=>await db.ImportJobs.AsNoTracking().OrderByDescending(x=>x.CreatedAtUtc).Select(x=>new{x.Id,x.ImportFile.OriginalFileName,x.Status,x.CreatedAtUtc,transactionCount=db.BankStatements.Where(s=>s.ImportJobId==x.Id).Join(db.BankTransactions,s=>s.Id,t=>t.BankStatementId,(s,t)=>t).Count(),warningCount=x.Warnings.Count}).Take(200).ToListAsync(ct));
api.MapGet("/imports/{id:guid}",async(Guid id,AppDbContext db,CancellationToken ct)=>await db.ImportJobs.AsNoTracking().Where(x=>x.Id==id).Select(x=>new{x.Id,x.Status,x.CreatedAtUtc,x.StartedAtUtc,x.CompletedAtUtc,x.AttemptCount,x.ErrorCode,x.ErrorMessage,x.ImportFile.OriginalFileName}).FirstOrDefaultAsync(ct) is{} x?Results.Ok(x):Results.NotFound());
api.MapPost("/imports/{id:guid}/retry",async(Guid id,AppDbContext db,CancellationToken ct)=>{var x=await db.ImportJobs.FindAsync([id],ct);if(x is null)return Results.NotFound();if(x.Status!=ImportStatus.Failed)return Results.Conflict(new{error="Only failed imports can be retried."});x.Status=ImportStatus.Pending;x.ErrorCode=x.ErrorMessage=null;await db.SaveChangesAsync(ct);return Results.Accepted($"/api/v1/imports/{id}");});
api.MapGet("/imports/{id:guid}/warnings",async(Guid id,AppDbContext db,CancellationToken ct)=>await db.ImportWarnings.AsNoTracking().Where(x=>x.ImportJobId==id).ToListAsync(ct));
api.MapGet("/categories",()=>Results.Ok(TransactionCategorizer.Taxonomy));
api.MapPut("/transactions/{id:guid}/category",async(Guid id,System.Text.Json.JsonElement body,AppDbContext db,CancellationToken ct)=>{var transaction=await db.BankTransactions.FindAsync([id],ct);if(transaction is null)return Results.NotFound();var category=body.TryGetProperty("category",out var c)?c.GetString():null;var subcategory=body.TryGetProperty("subcategory",out var s)?s.GetString():null;if(category is null||subcategory is null||!TransactionCategorizer.IsValid(category,subcategory))return Results.BadRequest(new{error="Invalid category or subcategory."});var applyToIban=body.TryGetProperty("applyToIban",out var a)&&a.ValueKind==System.Text.Json.JsonValueKind.True;var label=await db.TransactionLabels.FirstOrDefaultAsync(x=>x.BankTransactionId==id,ct);if(label is null){label=new TransactionLabel{BankTransactionId=id,Category=category,Subcategory=subcategory,Source=CategorySource.Manual};db.Add(label);}else{label.Category=category;label.Subcategory=subcategory;label.Source=CategorySource.Manual;label.UpdatedAtUtc=DateTimeOffset.UtcNow;}var affected=1;if(applyToIban&&!string.IsNullOrWhiteSpace(transaction.CounterpartyIban)){var iban=Normalization.Iban(transaction.CounterpartyIban)!;var rule=await db.CounterpartyCategoryRules.FirstOrDefaultAsync(x=>x.CounterpartyIban==iban,ct);if(rule is null){rule=new CounterpartyCategoryRule{CounterpartyIban=iban,Category=category,Subcategory=subcategory};db.Add(rule);}else{rule.Category=category;rule.Subcategory=subcategory;rule.UpdatedAtUtc=DateTimeOffset.UtcNow;}var ids=await db.BankTransactions.Where(x=>x.CounterpartyIban==iban).Select(x=>x.Id).ToListAsync(ct);var existing=await db.TransactionLabels.Where(x=>ids.Contains(x.BankTransactionId)).ToDictionaryAsync(x=>x.BankTransactionId,ct);foreach(var transactionId in ids){if(existing.TryGetValue(transactionId,out var item)){item.Category=category;item.Subcategory=subcategory;item.Source=CategorySource.IbanRule;item.UpdatedAtUtc=DateTimeOffset.UtcNow;}else db.Add(new TransactionLabel{BankTransactionId=transactionId,Category=category,Subcategory=subcategory,Source=CategorySource.IbanRule});}affected=ids.Count;}await db.SaveChangesAsync(ct);return Results.Ok(new{category,subcategory,source=applyToIban?CategorySource.IbanRule:CategorySource.Manual,affected,counterpartyIban=applyToIban?transaction.CounterpartyIban:null});});
api.MapGet("/category-rules",async(AppDbContext db,CancellationToken ct)=>await db.CounterpartyCategoryRules.AsNoTracking().OrderBy(x=>x.CounterpartyIban).ToListAsync(ct));
api.MapGet("/accounts",async(AppDbContext db,CancellationToken ct)=>await db.BankAccounts.AsNoTracking().OrderBy(x=>x.Iban).ToListAsync(ct));
api.MapPut("/accounts/{id:guid}",async(Guid id,System.Text.Json.JsonElement body,AppDbContext db,CancellationToken ct)=>{var account=await db.BankAccounts.FindAsync([id],ct);if(account is null)return Results.NotFound();var name=body.TryGetProperty("displayName",out var n)?n.GetString()?.Trim():null;if(name?.Length>100)return Results.BadRequest(new{error="Account name is limited to 100 characters."});var kind=body.TryGetProperty("accountKind",out var k)&&k.TryGetInt32(out var value)?value:0;if(!Enum.IsDefined(typeof(BankAccountKind),kind))return Results.BadRequest(new{error="Invalid account type."});account.DisplayName=string.IsNullOrWhiteSpace(name)?null:name;account.AccountKind=(BankAccountKind)kind;await db.SaveChangesAsync(ct);return Results.Ok(account);});api.MapGet("/accounts/{id:guid}",async(Guid id,AppDbContext db,CancellationToken ct)=>await db.BankAccounts.FindAsync([id],ct) is{}x?Results.Ok(x):Results.NotFound());api.MapGet("/accounts/{id:guid}/statements",async(Guid id,AppDbContext db,CancellationToken ct)=>await db.BankStatements.AsNoTracking().Where(x=>x.BankAccountId==id).ToListAsync(ct));
api.MapGet("/statements/{id:guid}",async(Guid id,AppDbContext db,CancellationToken ct)=>await db.BankStatements.FindAsync([id],ct) is{}x?Results.Ok(x):Results.NotFound());api.MapGet("/statements/{id:guid}/transactions",(Guid id,AppDbContext db,CancellationToken ct)=>Query(db,null,null,null,null,null,null,null,null,id,null,null,1,100,ct));api.MapGet("/accounts/{id:guid}/transactions",(Guid id,AppDbContext db,CancellationToken ct)=>Query(db,id,null,null,null,null,null,null,null,null,null,null,1,100,ct));api.MapGet("/transactions",(Guid? accountId,DateOnly? dateFrom,DateOnly? dateTo,decimal? minAmount,decimal? maxAmount,string? direction,string? currency,string? search,Guid? statementId,string? category,string? subcategory,int page,int pageSize,AppDbContext db,CancellationToken ct)=>Query(db,accountId,dateFrom,dateTo,minAmount,maxAmount,direction,currency,search,statementId,category,subcategory,page,pageSize,ct));api.MapGet("/transactions/{id:guid}",async(Guid id,AppDbContext db,CancellationToken ct)=>await db.BankTransactions.FindAsync([id],ct) is{}x?Results.Ok(x):Results.NotFound());
api.MapGet("/analytics/month", async (string? month, int? year, AppDbContext db, CancellationToken ct) =>
{
    var allTransactions = await db.BankTransactions.AsNoTracking().ToListAsync(ct);
    var accounts = await db.BankAccounts.AsNoTracking().ToListAsync(ct);
    var labels = await db.TransactionLabels.AsNoTracking().ToDictionaryAsync(x => x.BankTransactionId, ct);
    var latest = allTransactions.Count == 0 ? DateOnly.FromDateTime(DateTime.UtcNow) : allTransactions.Max(x => x.BookingDate);
    var selected = year.HasValue ? new DateOnly(year.Value, 1, 1) : DateOnly.TryParse((month ?? $"{latest:yyyy-MM}") + "-01", out var parsed) ? parsed : new DateOnly(latest.Year, latest.Month, 1);
    var end = year.HasValue ? new DateOnly(year.Value, 12, 31) : selected.AddMonths(1).AddDays(-1);
    var rows = allTransactions.Where(x => x.BookingDate >= selected && x.BookingDate <= end).OrderBy(x => x.BookingDate).ThenBy(x => x.CreatedAtUtc).ToList();
    var internalIbans = accounts.Where(x => !string.IsNullOrWhiteSpace(x.Iban)).Select(x => x.Iban!).ToHashSet(StringComparer.OrdinalIgnoreCase);
    var transferIds = rows.Where(x => !string.IsNullOrWhiteSpace(x.CounterpartyIban) && internalIbans.Contains(x.CounterpartyIban!)).Select(x => x.Id).ToHashSet();
    var debits = rows.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).ToList();
    var credits = rows.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).ToList();
    foreach (var debit in debits.Where(x => !transferIds.Contains(x.Id)))
    {
        var match = credits.FirstOrDefault(x => !transferIds.Contains(x.Id) && x.BankAccountId != debit.BankAccountId && x.Amount == debit.Amount && x.Currency == debit.Currency && Math.Abs(x.BookingDate.DayNumber - debit.BookingDate.DayNumber) <= 2 && ((!string.IsNullOrWhiteSpace(debit.EndToEndId) && debit.EndToEndId == x.EndToEndId) || (!string.IsNullOrWhiteSpace(debit.RemittanceInformation) && Normalization.Text(debit.RemittanceInformation)?.Equals(Normalization.Text(x.RemittanceInformation), StringComparison.OrdinalIgnoreCase) == true)));
        if (match is not null) { transferIds.Add(debit.Id); transferIds.Add(match.Id); }
    }
    var accountNames = accounts.ToDictionary(x => x.Id, x => x.DisplayName ?? x.AccountName ?? x.Iban ?? "Bank account");
    var entries = rows.Select(x =>
    {
        var transfer = transferIds.Contains(x.Id);
        labels.TryGetValue(x.Id, out var label);
        var direction = x.CreditDebitIndicator == CreditDebitIndicator.Credit ? "Incoming" : "Outgoing";
        var category = transfer ? "Transfers" : label?.Category ?? "Miscellaneous";
        var subcategory = transfer ? "Between own accounts" : label?.Subcategory ?? "Other";
        return new { transaction = x, direction, category, subcategory, accountName = accountNames.GetValueOrDefault(x.BankAccountId, "Bank account") };
    }).ToList();
    var groups = entries.GroupBy(x => new { x.direction, x.category, x.subcategory }).Select(g => new
    {
        direction = g.Key.direction, category = g.Key.category, subcategory = g.Key.subcategory,
        total = g.Sum(x => x.transaction.Amount), count = g.Count(),
        transactions = g.Select(x => new { x.transaction.Id, x.transaction.BookingDate, x.transaction.ValueDate, x.transaction.Amount, x.transaction.Currency, x.transaction.CounterpartyName, x.transaction.CounterpartyIban, x.transaction.RemittanceInformation, x.transaction.AdditionalInformation, x.transaction.EntryReference, x.transaction.AccountServicerReference, x.transaction.EndToEndId, x.transaction.BankAccountId, x.accountName }).ToList()
    }).OrderBy(x => x.direction).ThenByDescending(x => x.total).ToList();
    var incoming = entries.Where(x => x.direction == "Incoming").Sum(x => x.transaction.Amount);
    var outgoing = entries.Where(x => x.direction == "Outgoing").Sum(x => x.transaction.Amount);
    var transferIn = entries.Where(x => x.direction == "Transfer in").Sum(x => x.transaction.Amount);
    var transferOut = entries.Where(x => x.direction == "Transfer out").Sum(x => x.transaction.Amount);
    return Results.Ok(new { month = $"{selected:yyyy-MM}", year = selected.Year, isYear = year.HasValue, from = selected, to = end, currency = accounts.Select(x => x.Currency).Distinct().Count() == 1 ? accounts.FirstOrDefault()?.Currency : "MIXED", incoming, outgoing, net = incoming - outgoing, transferIn, transferOut, transactionCount = rows.Count, groups });
});
api.MapGet("/analytics/overview", async (int? months, string? period, AppDbContext db, CancellationToken ct) =>
{
    var transactions = await db.BankTransactions.AsNoTracking().ToListAsync(ct);
    var accounts = await db.BankAccounts.AsNoTracking().ToListAsync(ct);
    var statements = await db.BankStatements.AsNoTracking().ToListAsync(ct);
    var categoryLabels = await db.TransactionLabels.AsNoTracking().ToListAsync(ct);
    var labelByTransaction = categoryLabels.ToDictionary(x => x.BankTransactionId);
    var today = transactions.Count == 0 ? DateOnly.FromDateTime(DateTime.UtcNow) : transactions.Max(x => x.BookingDate);
    var selectedMonths = Math.Clamp(months ?? 1, 1, 12);
    var rangeStart = new DateOnly(today.Year, today.Month, 1).AddMonths(-(selectedMonths - 1));
    var rangeEnd = today;
    if (string.Equals(period, "this-year", StringComparison.OrdinalIgnoreCase)) rangeStart = new DateOnly(today.Year, 1, 1);
    if (string.Equals(period, "last-year", StringComparison.OrdinalIgnoreCase)) { rangeStart = new DateOnly(today.Year - 1, 1, 1); rangeEnd = new DateOnly(today.Year - 1, 12, 31); }
    var scopedTransactions = transactions.Where(x => x.BookingDate >= rangeStart && x.BookingDate <= rangeEnd).ToList();
    var monthStart = new DateOnly(today.Year, today.Month, 1);
    decimal Signed(BankTransaction x) => x.CreditDebitIndicator == CreditDebitIndicator.Credit ? x.Amount : -x.Amount;
    var statementDates = transactions.GroupBy(x => x.BankStatementId).ToDictionary(g => g.Key, g => g.Max(x => x.BookingDate)); var latestStatements = statements.GroupBy(x => x.BankAccountId).Select(g => g.OrderByDescending(x => statementDates.GetValueOrDefault(x.Id)).ThenByDescending(x => x.ToDateTimeUtc ?? x.CreatedDateTimeUtc).First()).ToList(); var balances = latestStatements.Select(x => x.ClosingBookedBalance ?? 0).ToList();
    var currentBalance = balances.Sum();
    var assets = balances.Where(x => x > 0).Sum();
    var liabilities = Math.Abs(balances.Where(x => x < 0).Sum());
    var month = scopedTransactions;
    var income = month.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).Sum(x => x.Amount);
    var expenses = month.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).Sum(x => x.Amount);
    var savings = income - expenses;
    var debits = scopedTransactions.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).ToList();
    var credits = scopedTransactions.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).ToList();
    var internalIbans = accounts.Where(x => !string.IsNullOrWhiteSpace(x.Iban)).Select(x => x.Iban!).ToHashSet(StringComparer.OrdinalIgnoreCase);
    var transferIds = scopedTransactions.Where(x => !string.IsNullOrWhiteSpace(x.CounterpartyIban) && internalIbans.Contains(x.CounterpartyIban!)).Select(x => x.Id).ToHashSet();
    foreach (var debit in debits.Where(x => !transferIds.Contains(x.Id)))
    {
        var match = credits.Where(x => !transferIds.Contains(x.Id) && x.BankAccountId != debit.BankAccountId && x.Amount == debit.Amount && x.Currency == debit.Currency && Math.Abs(x.BookingDate.DayNumber - debit.BookingDate.DayNumber) <= 2).FirstOrDefault(x => (!string.IsNullOrWhiteSpace(debit.EndToEndId) && debit.EndToEndId == x.EndToEndId) || (!string.IsNullOrWhiteSpace(debit.RemittanceInformation) && Normalization.Text(debit.RemittanceInformation)?.Equals(Normalization.Text(x.RemittanceInformation), StringComparison.OrdinalIgnoreCase) == true));
        if (match is not null) { transferIds.Add(debit.Id); transferIds.Add(match.Id); }
    }
    var externalDebits = debits;
    var externalCredits = credits;
    var monthly = scopedTransactions.GroupBy(x => new { x.BookingDate.Year, x.BookingDate.Month }).OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month).TakeLast(24).Select(g => new { period = $"{g.Key.Year:D4}-{g.Key.Month:D2}", income = g.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).Sum(x => x.Amount), expenses = g.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).Sum(x => x.Amount), transferIn = g.Where(x => transferIds.Contains(x.Id) && x.CreditDebitIndicator == CreditDebitIndicator.Credit).Sum(x => x.Amount), transferOut = g.Where(x => transferIds.Contains(x.Id) && x.CreditDebitIndicator == CreditDebitIndicator.Debit).Sum(x => x.Amount), externalIncoming = g.Where(x => !transferIds.Contains(x.Id) && x.CreditDebitIndicator == CreditDebitIndicator.Credit).Sum(x => x.Amount), externalOutgoing = g.Where(x => !transferIds.Contains(x.Id) && x.CreditDebitIndicator == CreditDebitIndicator.Debit).Sum(x => x.Amount), net = g.Sum(Signed) }).ToList();
    var daily = scopedTransactions.Where(x => x.BookingDate >= today.AddDays(-59)).GroupBy(x => x.BookingDate).OrderBy(g => g.Key).Select(g => new { date = g.Key, income = g.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).Sum(x => x.Amount), expenses = g.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).Sum(x => x.Amount), net = g.Sum(Signed) }).ToList();
    decimal running = currentBalance - transactions.Sum(Signed);
    var runningBalance = transactions.OrderBy(x => x.BookingDate).ThenBy(x => x.CreatedAtUtc).Select(x => new { date = x.BookingDate, balance = running += Signed(x) }).Where(x => x.date >= rangeStart && x.date <= rangeEnd).ToList();
    var totalDebit = externalDebits.Sum(x => x.Amount);
    var categories = externalDebits.GroupBy(x => transferIds.Contains(x.Id) ? "Transfers / Between own accounts" : labelByTransaction.TryGetValue(x.Id, out var label) ? $"{label.Category} / {label.Subcategory}" : "Miscellaneous / Other").Select(g => new { name = g.Key, total = g.Sum(x => x.Amount), count = g.Count(), monthlyAverage = g.Sum(x => x.Amount) / Math.Max(1, monthly.Count), percent = totalDebit == 0 ? 0 : g.Sum(x => x.Amount) / totalDebit * 100 }).OrderByDescending(x => x.total).Take(15).ToList();
    var merchants = externalDebits.GroupBy(x => string.IsNullOrWhiteSpace(x.CounterpartyName) ? "Unknown" : x.CounterpartyName!).Select(g => new { name = g.Key, total = g.Sum(x => x.Amount), count = g.Count(), average = g.Average(x => x.Amount) }).OrderByDescending(x => x.total).Take(12).ToList();
    var incomeSources = externalCredits.GroupBy(x => string.IsNullOrWhiteSpace(x.CounterpartyName) ? "Other income" : x.CounterpartyName!).Select(g => new { name = g.Key, total = g.Sum(x => x.Amount), count = g.Count(), average = g.Average(x => x.Amount) }).OrderByDescending(x => x.total).Take(10).ToList();
    var orderedExpenses = debits.Select(x => x.Amount).Order().ToList();
    var median = orderedExpenses.Count == 0 ? 0 : orderedExpenses.Count % 2 == 1 ? orderedExpenses[orderedExpenses.Count / 2] : (orderedExpenses[orderedExpenses.Count / 2 - 1] + orderedExpenses[orderedExpenses.Count / 2]) / 2;
    var averageMonthlyExpense = monthly.Count == 0 ? 0 : monthly.Average(x => x.expenses);
    var burnRate = debits.Where(x => x.BookingDate >= today.AddDays(-89)).Sum(x => x.Amount) / 90m;
    var weeks = scopedTransactions.Where(x => x.BookingDate >= today.AddDays(-83)).GroupBy(x => new { x.BookingDate.Year, Week = (x.BookingDate.DayOfYear - 1) / 7 }).OrderBy(g => g.Min(x => x.BookingDate)).Select(g => new { label = $"W{g.Key.Week + 1}", income = g.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).Sum(x => x.Amount), expenses = g.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).Sum(x => x.Amount), net = g.Sum(Signed) }).ToList();
    var heatmap = debits.GroupBy(x => x.BookingDate).Select(g => new { date = g.Key, value = g.Sum(x => x.Amount), count = g.Count() }).ToList();
    var positiveStreak = 0;
    foreach (var item in monthly.AsEnumerable().Reverse()) { if (item.net <= 0) break; positiveStreak++; }
    return Results.Ok(new
    {
        generatedAtUtc = DateTimeOffset.UtcNow, dataAsOf = rangeEnd, selectedMonths, rangeStart, period,
        currency = accounts.Select(x => x.Currency).Distinct().Count() == 1 ? accounts.FirstOrDefault()?.Currency : "MIXED",
        kpis = new { currentBalance, totalAssets = assets, totalLiabilities = liabilities, netWorth = assets - liabilities, incomeThisMonth = income, expensesThisMonth = expenses, savingsThisMonth = savings, savingsRate = income == 0 ? 0 : savings / income * 100, cashFlow = savings, averageDailySpending = expenses / Math.Max(1, today.Day), averageMonthlySpending = averageMonthlyExpense, burnRate, daysOfCashRemaining = burnRate <= 0 ? null : (decimal?)(Math.Max(0, currentBalance) / burnRate), emergencyFundMonths = averageMonthlyExpense <= 0 ? null : (decimal?)(Math.Max(0, currentBalance) / averageMonthlyExpense), largestExpense = month.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit).OrderByDescending(x => x.Amount).Select(x => (decimal?)x.Amount).FirstOrDefault(), largestIncome = month.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit).OrderByDescending(x => x.Amount).Select(x => (decimal?)x.Amount).FirstOrDefault(), transactionCount = scopedTransactions.Count, activeAccounts = accounts.Count, averageTransaction = scopedTransactions.Count == 0 ? 0 : scopedTransactions.Average(x => x.Amount), medianExpense = median, largestPurchase = debits.OrderByDescending(x => x.Amount).Select(x => (decimal?)x.Amount).FirstOrDefault(), smallestPurchase = debits.OrderBy(x => x.Amount).Select(x => (decimal?)x.Amount).FirstOrDefault(), purchaseCount = debits.Count, averageMonthlySurplus = monthly.Count == 0 ? 0 : monthly.Average(x => x.net), negativeCashFlowMonths = monthly.Count(x => x.net < 0), positiveCashFlowStreak = positiveStreak },
        monthly, daily, weeks, runningBalance, categories, merchants, incomeSources, heatmap,
        accounts = accounts.Select(a => new { a.Id, a.Iban, a.AccountName, a.DisplayName, a.AccountKind, a.Currency, balance = latestStatements.Where(s => s.BankAccountId == a.Id).Select(s => s.ClosingBookedBalance).FirstOrDefault() }),
        unavailable = new[] { "Credit utilization requires credit-limit data", "Days until next paycheck requires a payroll schedule", "Payment method is not consistently supplied by CAMT", "Forecasts require more history and an explicit forecasting model" }
    });
});

using(var scope=app.Services.CreateScope()){var db=scope.ServiceProvider.GetRequiredService<AppDbContext>();await db.Database.EnsureCreatedAsync();await db.Database.ExecuteSqlRawAsync("ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS display_name text; ALTER TABLE bank_accounts ADD COLUMN IF NOT EXISTS account_kind integer NOT NULL DEFAULT 0; CREATE TABLE IF NOT EXISTS transaction_labels (id uuid PRIMARY KEY, bank_transaction_id uuid NOT NULL UNIQUE, category text NOT NULL, subcategory text NOT NULL, source integer NOT NULL, updated_at_utc timestamp with time zone NOT NULL); CREATE TABLE IF NOT EXISTS counterparty_category_rules (id uuid PRIMARY KEY, counterparty_iban text NOT NULL UNIQUE, category text NOT NULL, subcategory text NOT NULL, created_at_utc timestamp with time zone NOT NULL, updated_at_utc timestamp with time zone NOT NULL);");await db.Database.ExecuteSqlRawAsync("CREATE TABLE IF NOT EXISTS application_users (id uuid PRIMARY KEY, email text NOT NULL UNIQUE, display_name text NOT NULL, password_hash text NOT NULL, role integer NOT NULL, is_active boolean NOT NULL, created_at_utc timestamp with time zone NOT NULL, updated_at_utc timestamp with time zone NOT NULL, last_login_at_utc timestamp with time zone NULL);");await EnsureLabelsAsync(db);}await app.RunAsync();
static async Task<object> Save(Stream source,string name,AppDbContext db,IObjectStorage storage,CancellationToken ct){using var m=new MemoryStream();await source.CopyToAsync(m,ct);var hash=Convert.ToHexString(SHA256.HashData(m.ToArray())).ToLowerInvariant();var existing=await db.ImportFiles.AsNoTracking().FirstOrDefaultAsync(x=>x.Sha256==hash,ct);if(existing is not null){var dup=new ImportJob{ImportFileId=existing.Id,Status=ImportStatus.Duplicate,CompletedAtUtc=DateTimeOffset.UtcNow};db.Add(dup);await db.SaveChangesAsync(ct);return new{dup.Id,status=dup.Status,statusUrl=$"/api/v1/imports/{dup.Id}"};}var f=new ImportFile{OriginalFileName=name,ObjectStorageKey=$"imports/{hash[..2]}/{hash}.xml",Sha256=hash,ContentLength=m.Length,ContentType="application/xml"};m.Position=0;await storage.PutAsync(f.ObjectStorageKey,m,f.ContentType,ct);var j=new ImportJob{ImportFileId=f.Id};db.AddRange(f,j);await db.SaveChangesAsync(ct);return new{j.Id,status=j.Status,statusUrl=$"/api/v1/imports/{j.Id}"};}
static async Task<IResult> Query(AppDbContext db, Guid? accountId, DateOnly? from, DateOnly? to, decimal? min, decimal? max, string? direction, string? currency, string? search, Guid? statementId, string? category, string? subcategory, int page, int pageSize, CancellationToken ct)
{
    page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 200);
    var q = db.BankTransactions.AsNoTracking();
    if (accountId.HasValue) q = q.Where(x => x.BankAccountId == accountId);
    if (statementId.HasValue) q = q.Where(x => x.BankStatementId == statementId);
    if (from.HasValue) q = q.Where(x => x.BookingDate >= from);
    if (to.HasValue) q = q.Where(x => x.BookingDate <= to);
    if (min.HasValue) q = q.Where(x => x.Amount >= min);
    if (max.HasValue) q = q.Where(x => x.Amount <= max);
    if (direction == "credit") q = q.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Credit);
    if (direction == "debit") q = q.Where(x => x.CreditDebitIndicator == CreditDebitIndicator.Debit);
    if (!string.IsNullOrWhiteSpace(currency)) q = q.Where(x => x.Currency == currency.ToUpper());
    if (!string.IsNullOrWhiteSpace(search)) q = q.Where(x => EF.Functions.ILike(x.CounterpartyName ?? "", "%" + search + "%") || EF.Functions.ILike(x.RemittanceInformation ?? "", "%" + search + "%"));
    if (!string.IsNullOrWhiteSpace(category)) { var categorizedIds = db.TransactionLabels.Where(x => x.Category == category && (string.IsNullOrWhiteSpace(subcategory) || x.Subcategory == subcategory)).Select(x => x.BankTransactionId); q = q.Where(x => categorizedIds.Contains(x.Id)); }
    var count = await q.CountAsync(ct);
    var entities = await q.OrderByDescending(x => x.BookingDate).ThenByDescending(x => x.CreatedAtUtc).ThenByDescending(x => x.Id).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
    var entityIds = entities.Select(t => t.Id).ToList();
    var labels = await db.TransactionLabels.AsNoTracking().Where(x => entityIds.Contains(x.BankTransactionId)).ToDictionaryAsync(x => x.BankTransactionId, ct);
    var accountIds = entities.Select(x => x.BankAccountId).Distinct().ToList();
    var accountTransactions = await db.BankTransactions.AsNoTracking().Where(x => accountIds.Contains(x.BankAccountId)).OrderBy(x => x.BookingDate).ThenBy(x => x.CreatedAtUtc).ThenBy(x => x.Id).ToListAsync(ct);
    var accountStatements = await db.BankStatements.AsNoTracking().Where(x => accountIds.Contains(x.BankAccountId)).ToListAsync(ct);
    var balances = new Dictionary<Guid, decimal>();
    foreach (var statementGroup in accountTransactions.GroupBy(x => x.BankStatementId))
    {
        var statement = accountStatements.FirstOrDefault(x => x.Id == statementGroup.Key);
        var ordered = statementGroup.OrderBy(x => x.BookingDate).ThenBy(x => x.CreatedAtUtc).ThenBy(x => x.Id).ToList();
        if (statement?.ClosingBookedBalance is decimal closing)
        {
            var running = closing;
            foreach (var transaction in ordered.AsEnumerable().Reverse())
            {
                balances[transaction.Id] = running;
                running -= transaction.CreditDebitIndicator == CreditDebitIndicator.Credit ? transaction.Amount : -transaction.Amount;
            }
        }
        else
        {
            var running = statement?.OpeningBookedBalance ?? 0m;
            foreach (var transaction in ordered)
            {
                running += transaction.CreditDebitIndicator == CreditDebitIndicator.Credit ? transaction.Amount : -transaction.Amount;
                balances[transaction.Id] = running;
            }
        }
    }    var items = entities.Select(x => new { x.Id, x.BankStatementId, x.BankAccountId, x.EntryReference, x.AccountServicerReference, x.InstructionId, x.EndToEndId, x.MandateId, x.TransactionId, x.BookingDate, x.ValueDate, x.Amount, x.Currency, x.CreditDebitIndicator, x.Status, x.BankTransactionCode, x.ProprietaryTransactionCode, x.CounterpartyName, x.CounterpartyIban, x.CounterpartyBic, x.RemittanceInformation, x.AdditionalInformation, x.Fingerprint, x.RawEntryJson, x.CreatedAtUtc, category = labels.TryGetValue(x.Id, out var label) ? label.Category : null, subcategory = labels.TryGetValue(x.Id, out label) ? label.Subcategory : null, categorySource = labels.TryGetValue(x.Id, out label) ? (int?)label.Source : null, balanceAfterTransaction = balances.GetValueOrDefault(x.Id) }).ToList();
    return Results.Ok(new { items, page, pageSize, total = count });
}
static async Task EnsureLabelsAsync(AppDbContext db)
{
    var rules = await db.CounterpartyCategoryRules.AsNoTracking().ToDictionaryAsync(x => x.CounterpartyIban);
    var labeledIds = await db.TransactionLabels.AsNoTracking().Select(x => x.BankTransactionId).ToHashSetAsync();
    var missing = await db.BankTransactions.AsNoTracking().Where(x => !labeledIds.Contains(x.Id)).ToListAsync();
    foreach (var transaction in missing)
    {
        var iban = Normalization.Iban(transaction.CounterpartyIban);
        if (iban is not null && rules.TryGetValue(iban, out var rule)) db.Add(new TransactionLabel { BankTransactionId = transaction.Id, Category = rule.Category, Subcategory = rule.Subcategory, Source = CategorySource.IbanRule });
        else { var match = TransactionCategorizer.Classify(transaction.CounterpartyName, transaction.RemittanceInformation, transaction.BankTransactionCode, transaction.CreditDebitIndicator == CreditDebitIndicator.Credit); db.Add(new TransactionLabel { BankTransactionId = transaction.Id, Category = match.Category, Subcategory = match.Subcategory, Source = CategorySource.Automatic }); }
    }
    await db.SaveChangesAsync();
}