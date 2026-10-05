import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

type RepoFile = { name: string; type: 'file' | 'folder'; message: string; age: string };
type Repository = {
  owner: string; name: string; description: string; stars: number; forks: number;
  watchers: number; commits: number; updated: string; fileName: string;
  code: string; readmeTitle: string; readme: string; files: RepoFile[];
};
type ProjectDetails = { kind: string; folder: string; symbols: string[]; commitAge: string; hash: string };

const commonFiles: RepoFile[] = [
  { name: '.github', type: 'folder', message: 'Configure build workflow', age: '3 weeks ago' },
  { name: 'Properties', type: 'folder', message: 'Update launch settings', age: 'last month' },
  { name: '.gitignore', type: 'file', message: 'Ignore generated artifacts', age: '2 months ago' },
  { name: 'README.md', type: 'file', message: 'Improve usage examples', age: 'yesterday' }
];

const repositories: Repository[] = [
  {
    owner: 'code-labs', name: 'json-string-list-converter',
    description: 'A compact System.Text.Json converter for flexible string collections.',
    stars: 128, forks: 19, watchers: 8, commits: 34, updated: 'Update converter behavior',
    fileName: 'JsonStringListConverter.cs',
    code: `using System.Text.Json;
using System.Text.Json.Serialization;

public sealed class JsonStringListConverter : JsonConverter<List<string>>
{
    public override List<string> Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
            return [reader.GetString()!];

        return JsonSerializer.Deserialize<List<string>>(ref reader, options) ?? [];
    }

    public override void Write(Utf8JsonWriter writer, List<string> value,
        JsonSerializerOptions options) => JsonSerializer.Serialize(writer, value, options);
}`,
    readmeTitle: 'JSON String List Converter',
    readme: 'Deserialize either a single JSON string or an array into one predictable list. Built for small .NET 8 services that consume inconsistent third-party payloads.',
    files: [...commonFiles, { name: 'JsonStringListConverter.cs', type: 'file', message: 'Handle scalar JSON values', age: '2 hours ago' }, { name: 'JsonConverterDemo.csproj', type: 'file', message: 'Target .NET 8', age: '2 hours ago' }]
  },
  {
    owner: 'dotnet-practice', name: 'order-grouper', description: 'Group customer orders with safe fallback keys.',
    stars: 74, forks: 11, watchers: 6, commits: 21, updated: 'Add null-safe grouping', fileName: 'OrderGrouper.cs',
    code: `namespace OrderGrouper.Services;

public sealed record Customer(string? Country);
public sealed record Order(int Id, Customer? Customer);

public sealed class OrderGroupingService
{
    public IReadOnlyDictionary<string, List<Order>> GroupByCountry(
        IEnumerable<Order> orders)
    {
        return orders
            .GroupBy(order => order.Customer?.Country ?? "unknown")
            .ToDictionary(group => group.Key, group => group.ToList());
    }
}`,
    readmeTitle: 'Order Grouper', readme: 'A readable console example that groups incomplete order records without losing data or throwing null-reference exceptions.',
    files: [...commonFiles, { name: 'OrderGrouper.cs', type: 'file', message: 'Use stable fallback country', age: '4 hours ago' }, { name: 'OrderGrouper.csproj', type: 'file', message: 'Initial project setup', age: 'last week' }]
  },
  {
    owner: 'daily-csharp', name: 'word-frequency', description: 'Count and rank words from console input.',
    stars: 203, forks: 31, watchers: 12, commits: 48, updated: 'Normalize punctuation', fileName: 'WordFrequency.cs',
    code: `Console.WriteLine("Enter text:");
var text = Console.ReadLine() ?? string.Empty;

var counts = text
    .Split([' ', ',', '.', '!', '?'], StringSplitOptions.RemoveEmptyEntries)
    .Select(word => word.ToLowerInvariant())
    .GroupBy(word => word)
    .Select(group => new { Word = group.Key, Count = group.Count() })
    .OrderByDescending(item => item.Count);

foreach (var item in counts)
    Console.WriteLine($"{item.Word}: {item.Count}");`,
    readmeTitle: 'Word Frequency', readme: 'Enter a sentence and receive a frequency table ordered by the most common word using standard LINQ operators.',
    files: [...commonFiles, { name: 'WordFrequency.cs', type: 'file', message: 'Sort frequency results', age: '6 hours ago' }, { name: 'WordFrequency.csproj', type: 'file', message: 'Create console project', age: '3 days ago' }]
  },
  {
    owner: 'algorithm-notes', name: 'balanced-brackets', description: 'Validate nested brackets using a stack.',
    stars: 316, forks: 52, watchers: 18, commits: 27, updated: 'Cover mixed bracket pairs', fileName: 'BalancedBrackets.cs',
    code: `namespace BracketValidation;

public static class BracketValidator
{
    private static readonly Dictionary<char, char> MatchingPairs = new()
    {
        [')'] = '(', [']'] = '[', ['}'] = '{'
    };

    public static bool IsBalanced(string input)
    {
        var stack = new Stack<char>();
        foreach (var character in input)
        {
            if ("([{".Contains(character)) stack.Push(character);
            else if (MatchingPairs.TryGetValue(character, out var opening) &&
                     (stack.Count == 0 || stack.Pop() != opening)) return false;
        }

        return stack.Count == 0;
    }
}`,
    readmeTitle: 'Balanced Brackets', readme: 'A single-pass stack solution for validating parentheses, square brackets, and braces in user input.',
    files: [...commonFiles, { name: 'BalancedBrackets.cs', type: 'file', message: 'Validate nested pairs', age: 'today' }, { name: 'BalancedBrackets.csproj', type: 'file', message: 'Enable implicit usings', age: 'today' }]
  },
  {
    owner: 'clean-console', name: 'expense-summary', description: 'Summarize categorized expenses from a simple input list.',
    stars: 91, forks: 14, watchers: 5, commits: 39, updated: 'Format currency totals', fileName: 'ExpenseSummary.cs',
    code: `var expenses = new[]
{
    (Category: "Travel", Amount: 84.50m),
    (Category: "Food", Amount: 22.10m),
    (Category: "Travel", Amount: 15.00m)
};

var summary = expenses
    .GroupBy(expense => expense.Category)
    .Select(group => new { Category = group.Key, Total = group.Sum(x => x.Amount) })
    .OrderByDescending(item => item.Total);

foreach (var item in summary)
    Console.WriteLine($"{item.Category}: {item.Total:C}");`,
    readmeTitle: 'Expense Summary', readme: 'Group decimal expense values by category and print a concise currency report from a .NET 8 console application.',
    files: [...commonFiles, { name: 'ExpenseSummary.cs', type: 'file', message: 'Add grouped totals', age: 'yesterday' }, { name: 'ExpenseSummary.csproj', type: 'file', message: 'Set invariant defaults', age: 'last week' }]
  },
  {
    owner: 'coding-rounds', name: 'duplicate-finder', description: 'Find duplicate integers while preserving discovery order.',
    stars: 167, forks: 25, watchers: 9, commits: 18, updated: 'Preserve duplicate order', fileName: 'DuplicateFinder.cs',
    code: `var numbers = new[] { 4, 2, 7, 4, 8, 2, 4 };
var seen = new HashSet<int>();
var duplicates = new HashSet<int>();

foreach (var number in numbers)
{
    if (!seen.Add(number))
        duplicates.Add(number);
}

Console.WriteLine(string.Join(", ", duplicates));`,
    readmeTitle: 'Duplicate Finder', readme: 'An approachable HashSet-based solution that identifies repeated numbers in linear time.',
    files: [...commonFiles, { name: 'DuplicateFinder.cs', type: 'file', message: 'Track repeated values', age: '3 hours ago' }, { name: 'DuplicateFinder.csproj', type: 'file', message: 'Add project definition', age: '2 days ago' }]
  },
  {
    owner: 'async-samples', name: 'parallel-url-checker', description: 'Check several endpoints concurrently with a shared HttpClient.',
    stars: 442, forks: 67, watchers: 24, commits: 63, updated: 'Handle request failures', fileName: 'UrlChecker.cs',
    code: `namespace ServiceHealth.Workers;

public sealed class UrlHealthWorker(HttpClient client)
{
    public async Task<IReadOnlyList<HealthResult>> CheckAsync(
        IEnumerable<string> urls,
        CancellationToken cancellationToken)
    {
        var checks = urls.Select(async url =>
        {
            try
            {
                using var response = await client.GetAsync(url, cancellationToken);
                return new HealthResult(url, response.IsSuccessStatusCode);
            }
            catch (HttpRequestException)
            {
                return new HealthResult(url, false);
            }
        });

        return await Task.WhenAll(checks);
    }
}

public sealed record HealthResult(string Url, bool IsHealthy);`,
    readmeTitle: 'Parallel URL Checker', readme: 'Perform HTTP health checks concurrently and report each status without stopping on individual failures.',
    files: [...commonFiles, { name: 'UrlChecker.cs', type: 'file', message: 'Run checks concurrently', age: '5 hours ago' }, { name: 'UrlChecker.csproj', type: 'file', message: 'Target .NET 8', age: '5 days ago' }]
  },
  {
    owner: 'interview-kit', name: 'inventory-tracker', description: 'Apply stock movements and print the current inventory.',
    stars: 119, forks: 22, watchers: 7, commits: 42, updated: 'Reject negative inventory', fileName: 'InventoryTracker.cs',
    code: `var inventory = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
var movements = new[] { ("Keyboard", 5), ("Mouse", 8), ("Keyboard", -2) };

foreach (var (product, quantity) in movements)
{
    inventory.TryGetValue(product, out var current);
    var next = current + quantity;
    if (next < 0)
        throw new InvalidOperationException("Stock cannot be negative.");

    inventory[product] = next;
}

foreach (var item in inventory.OrderBy(item => item.Key))
    Console.WriteLine($"{item.Key}: {item.Value}");`,
    readmeTitle: 'Inventory Tracker', readme: 'Apply incoming and outgoing stock movements while protecting inventory from invalid negative quantities.',
    files: [...commonFiles, { name: 'InventoryTracker.cs', type: 'file', message: 'Validate stock changes', age: '8 hours ago' }, { name: 'InventoryTracker.csproj', type: 'file', message: 'Create application', age: '4 days ago' }]
  }
];

function buildExpandedCode(source: string, details: ProjectDetails): string {
  const cases = Array.from({ length: 24 }, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    return `        new("Case ${number}", "Input ${number}", "Expected ${number}")`;
  }).join(',\n');

  const supportCode = `

public sealed record ChallengeResult<T>(
    bool IsSuccess,
    T? Value,
    string? Error)
{
    public static ChallengeResult<T> Success(T value)
    {
        return new ChallengeResult<T>(true, value, null);
    }

    public static ChallengeResult<T> Failure(string error)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(error);
        return new ChallengeResult<T>(false, default, error);
    }
}

public sealed class ChallengeOptions
{
    public string ProjectType { get; init; } = "${details.kind}";
    public bool EnableValidation { get; init; } = true;
    public int MaximumItems { get; init; } = 1_000;
    public TimeSpan Timeout { get; init; } = TimeSpan.FromSeconds(30);

    public void Validate()
    {
        if (MaximumItems <= 0)
            throw new InvalidOperationException("Maximum items must be positive.");

        if (Timeout <= TimeSpan.Zero)
            throw new InvalidOperationException("Timeout must be positive.");
    }
}

public interface IResultStore<T>
{
    void Add(T item);
    IReadOnlyList<T> GetAll();
    void Clear();
}

public sealed class InMemoryResultStore<T> : IResultStore<T>
{
    private readonly List<T> _items = [];

    public void Add(T item)
    {
        ArgumentNullException.ThrowIfNull(item);
        _items.Add(item);
    }

    public IReadOnlyList<T> GetAll()
    {
        return _items.AsReadOnly();
    }

    public void Clear()
    {
        _items.Clear();
    }
}

public sealed record ChallengeCase(
    string Name,
    string Input,
    string Expected);

public static class ${details.symbols[0]}Examples
{
    public static IReadOnlyList<ChallengeCase> All { get; } =
    [
${cases}
    ];

    public static ChallengeCase? Find(string name)
    {
        return All.FirstOrDefault(item =>
            string.Equals(item.Name, name, StringComparison.OrdinalIgnoreCase));
    }
}`;

  return `${source.trimEnd()}${supportCode}`;
}

@Component({ selector: 'app-root', imports: [CommonModule], templateUrl: './app.html', styleUrl: './app.css' })
export class App {
  private readonly publishEndpoint = 'http://localhost:5065/api/challenges/publish';

  readonly repository = repositories[Math.floor(Math.random() * repositories.length)];
  readonly activeTab = signal('Code');
  readonly branchOpen = signal(false);
  readonly starred = signal(false);
  readonly copied = signal(false);
  readonly promptText = signal('');
  readonly codeText = signal('');
  readonly generatedCode = signal<string | null>(null);
  readonly generatedFileName = signal<string | null>(null);
  readonly requestStatus = signal('Waiting for clipboard input.');
  readonly requestTone = signal<'idle' | 'working' | 'success' | 'error'>('idle');
  readonly isPublishing = signal(false);
  readonly projectDetails = this.getProjectDetails(this.repository.name);
  readonly displayCode = buildExpandedCode(this.repository.code, this.projectDetails);
  readonly visibleCode = computed(() => this.generatedCode() ?? this.displayCode);
  readonly visibleFileName = computed(() => this.generatedFileName() ?? this.repository.fileName);
  readonly lines = computed(() => this.visibleCode().split('\n'));

  setTab(tab: string): void { this.activeTab.set(tab); }
  async capturePrompt(): Promise<void> {
    this.activeTab.set('Code');

    try {
      const text = await this.readClipboard();
      this.promptText.set(text);
      this.requestStatus.set('Question and instructions captured from clipboard.');
      this.requestTone.set('success');
    } catch (error) {
      this.setRequestError(error, 'Unable to read the clipboard.');
    }
  }

  async publishClipboardCode(): Promise<void> {
    if (this.isPublishing()) return;

    this.isPublishing.set(true);
    this.requestStatus.set('Reading code and generating the solution...');
    this.requestTone.set('working');

    try {
      const code = await this.readClipboard();
      this.codeText.set(code);

      const response = await fetch(this.publishEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstText: this.promptText(),
          secondText: code
        })
      });

      const result = await response.json() as PublishResult;
      if (!response.ok) {
        throw new Error(result.error ?? 'The publishing request failed.');
      }

      if (!result.code || !result.fileName) {
        throw new Error('The server returned an incomplete response.');
      }

      this.generatedCode.set(result.code);
      this.generatedFileName.set(result.fileName);
      this.requestStatus.set(`Published to ${result.path ?? result.fileName}.`);
      this.requestTone.set('success');
    } catch (error) {
      this.setRequestError(error, 'Unable to generate and publish the solution.');
    } finally {
      this.isPublishing.set(false);
    }
  }

  toggleBranch(): void { this.branchOpen.update(value => !value); }
  toggleStar(): void { this.starred.update(value => !value); }
  async copyCode(): Promise<void> {
    await navigator.clipboard.writeText(this.visibleCode());
    this.copied.set(true);
    window.setTimeout(() => this.copied.set(false), 1600);
  }

  private async readClipboard(): Promise<string> {
    if (!window.isSecureContext || !navigator.clipboard?.readText) {
      throw new Error('Clipboard access requires HTTPS or localhost.');
    }

    return navigator.clipboard.readText();
  }

  private setRequestError(error: unknown, fallback: string): void {
    this.requestStatus.set(error instanceof Error ? error.message : fallback);
    this.requestTone.set('error');
  }

  private getProjectDetails(name: string): ProjectDetails {
    const details: Record<string, ProjectDetails> = {
      'json-string-list-converter': { kind: 'Class Library', folder: 'Converters', symbols: ['JsonStringListConverter', 'Read', 'Write'], commitAge: '4 years ago', hash: '8a71dc2' },
      'order-grouper': { kind: 'Domain Service', folder: 'Services', symbols: ['Customer', 'Order', 'OrderGroupingService', 'GroupByCountry'], commitAge: '9 months ago', hash: 'c41f0ab' },
      'word-frequency': { kind: 'Text Processing API', folder: 'Text', symbols: ['WordFrequencyService', 'CountWords', 'Normalize'], commitAge: '2 years ago', hash: '12d9b63' },
      'balanced-brackets': { kind: 'Validation Library', folder: 'Validation', symbols: ['BracketValidator', 'IsBalanced', 'MatchingPairs'], commitAge: '18 months ago', hash: 'e08a174' },
      'expense-summary': { kind: 'Reporting Service', folder: 'Reports', symbols: ['Expense', 'ExpenseReport', 'BuildSummary'], commitAge: '3 years ago', hash: '74bc291' },
      'duplicate-finder': { kind: 'Collections Library', folder: 'Collections', symbols: ['DuplicateFinder', 'Find', 'seen', 'duplicates'], commitAge: '7 months ago', hash: 'ba3098f' },
      'parallel-url-checker': { kind: 'Background Worker', folder: 'HealthChecks', symbols: ['UrlHealthWorker', 'ExecuteAsync', 'CheckAsync'], commitAge: '5 years ago', hash: '4f711de' },
      'inventory-tracker': { kind: 'Web API Domain', folder: 'Domain', symbols: ['InventoryService', 'ApplyMovement', 'GetCurrentStock'], commitAge: '11 months ago', hash: '9c25ad0' }
    };

    return details[name];
  }
}

type PublishResult = {
  fileName?: string;
  path?: string;
  code?: string;
  error?: string;
};
