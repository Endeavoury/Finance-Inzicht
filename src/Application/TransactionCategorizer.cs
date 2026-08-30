namespace Oikonomis.Application;

public sealed record CategoryGroup(string Name, IReadOnlyList<string> Subcategories);
public sealed record CategoryMatch(string Category, string Subcategory);

public static class TransactionCategorizer
{
    public static IReadOnlyList<CategoryGroup> Taxonomy { get; } =
    [
        new("Income", ["Work Income", "Salary", "Bonus", "Freelance Income", "Benefits", "Pension", "Interest", "Dividends", "Refunds", "Other Income"]),
        new("Housing", ["Rent/Mortgage", "Property Tax", "Home Insurance", "Maintenance & Repairs", "Furniture & Home Decor"]),
        new("Utilities", ["Electricity", "Gas", "Water", "Internet", "Mobile Phone", "Streaming Services"]),
        new("Food", ["Groceries", "Restaurants", "Coffee & Snacks", "Food Delivery"]),
        new("Transportation", ["Fuel", "Public Transport", "Car Payment", "Car Insurance", "Maintenance", "Parking & Tolls"]),
        new("Health", ["Health Insurance", "Doctor & Dentist", "Pharmacy", "Gym", "Mental Health"]),
        new("Shopping", ["Clothing", "Electronics", "Household Items", "Personal Care"]),
        new("Entertainment", ["Movies", "Gaming", "Hobbies", "Events", "Subscriptions"]),
        new("Travel", ["Flights", "Hotels", "Transport", "Activities", "Travel Insurance"]),
        new("Education", ["Courses", "Books", "Certifications", "School Expenses"]),
        new("Financial", ["Savings", "Investments", "Emergency Fund", "Loan Payments", "Credit Card Payments", "Bank Fees"]),
        new("Gifts & Donations", ["Gifts", "Charity", "Special Occasions"]),
        new("Family & Kids", ["Childcare", "School Supplies", "Toys", "Allowance"]),
        new("Pets", ["Food", "Vet", "Grooming", "Supplies"]),
        new("Work", ["Office Supplies", "Business Expenses", "Professional Memberships"]),
        new("Miscellaneous", ["Taxes", "Government Fees", "Unexpected Expenses", "Other"])
    ];

    public static bool IsValid(string category, string subcategory) =>
        Taxonomy.Any(x => x.Name == category && x.Subcategories.Contains(subcategory));

    public static CategoryMatch Classify(string? counterparty, string? remittance, string? bankCode, bool isCredit = false)
    {
        var text = $"{counterparty} {remittance} {bankCode}".ToLowerInvariant();
        if (isCredit && Has(text, "salary", "salaris", "loon", "payroll", "wages", "paycheck", "werkgever", "employer")) return new("Income", "Work Income");
        if (isCredit && Has(text, "bonus", "vakantiegeld", "13th month", "dertiende maand")) return new("Income", "Bonus");
        if (isCredit && Has(text, "freelance", "invoice payment", "factuur betaling")) return new("Income", "Freelance Income");
        if (isCredit && Has(text, "interest", "rente")) return new("Income", "Interest");
        if (isCredit && Has(text, "dividend")) return new("Income", "Dividends");
        if (isCredit && Has(text, "refund", "restitution", "terugbetaling")) return new("Income", "Refunds");
        if (Has(text, "huur", "rent", "mortgage", "hypotheek")) return new("Housing", "Rent/Mortgage");
        if (Has(text, "property tax", "ozb")) return new("Housing", "Property Tax");
        if (Has(text, "home insurance", "woonverzekering")) return new("Housing", "Home Insurance");
        if (Has(text, "ikea", "furniture", "meubel")) return new("Housing", "Furniture & Home Decor");
        if (Has(text, "vattenfall", "eneco", "essent", "electric", "energie")) return new("Utilities", "Electricity");
        if (Has(text, "waternet", "vitens", "waterbedrijf")) return new("Utilities", "Water");
        if (Has(text, "ziggo", "kpn", "internet")) return new("Utilities", "Internet");
        if (Has(text, "vodafone", "odido", "tele2", "mobile phone")) return new("Utilities", "Mobile Phone");
        if (Has(text, "netflix", "disney+", "hbo max", "videoland", "spotify")) return new("Utilities", "Streaming Services");
        if (Has(text, "albert heijn", "jumbo", "lidl", "aldi", "plus ", "dirk", "supermarket", "supermarkt")) return new("Food", "Groceries");
        if (Has(text, "thuisbezorgd", "deliveroo", "uber eats")) return new("Food", "Food Delivery");
        if (Has(text, "starbucks", "coffee", "koffie")) return new("Food", "Coffee & Snacks");
        if (Has(text, "restaurant", "cafe", "brasserie", "mcdonald", "burger king")) return new("Food", "Restaurants");
        if (Has(text, "shell", "esso", "bp ", "totalenergies", "benzine", "fuel")) return new("Transportation", "Fuel");
        if (Has(text, "ovpay", "nederlandse spoorwegen", " ns ", "arriva", "gvb", "ret ", "public transport")) return new("Transportation", "Public Transport");
        if (Has(text, "parking", "parkeren", "toll", "tolweg")) return new("Transportation", "Parking & Tolls");
        if (Has(text, "car insurance", "autoverzekering")) return new("Transportation", "Car Insurance");
        if (Has(text, "health insurance", "zorgverzekering", "zilveren kruis", "vgz", "cz zorg")) return new("Health", "Health Insurance");
        if (Has(text, "apotheek", "pharmacy")) return new("Health", "Pharmacy");
        if (Has(text, "doctor", "dentist", "tandarts", "huisarts")) return new("Health", "Doctor & Dentist");
        if (Has(text, "basic-fit", "gym", "fitness")) return new("Health", "Gym");
        if (Has(text, "amazon", "coolblue", "mediamarkt", "electronics")) return new("Shopping", "Electronics");
        if (Has(text, "zalando", "h&m", "clothing", "kleding")) return new("Shopping", "Clothing");
        if (Has(text, "cinema", "bioscoop", "pathe", "movie")) return new("Entertainment", "Movies");
        if (Has(text, "playstation", "xbox", "nintendo", "steam", "gaming")) return new("Entertainment", "Gaming");
        if (Has(text, "booking.com", "hotel", "airbnb")) return new("Travel", "Hotels");
        if (Has(text, "klm", "transavia", "ryanair", "easyjet", "flight")) return new("Travel", "Flights");
        if (Has(text, "book", "boekhandel")) return new("Education", "Books");
        if (Has(text, "course", "cursus", "udemy", "coursera")) return new("Education", "Courses");
        if (Has(text, "investment", "belegging", "degiro", "broker")) return new("Financial", "Investments");
        if (Has(text, "loan", "lening")) return new("Financial", "Loan Payments");
        if (Has(text, "bank fee", "bankkosten")) return new("Financial", "Bank Fees");
        if (Has(text, "charity", "donation", "donatie", "stichting")) return new("Gifts & Donations", "Charity");
        if (Has(text, "belastingdienst", "tax")) return new("Miscellaneous", "Taxes");
        if (Has(text, "government", "gemeente", "leges")) return new("Miscellaneous", "Government Fees");
        return new("Miscellaneous", "Other");
    }

    private static bool Has(string text, params string[] values) => values.Any(text.Contains);
}
