import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPerfPilotTools(server: McpServer) {
  // Tool 1: Generate load test script
  server.tool(
    "perf_generate_load_test",
    "Generate a comprehensive load test script for your application endpoints",
    {
      base_url: z.string().describe("Base URL of the application"),
      endpoints: z
        .array(
          z.object({
            method: z.enum(["GET", "POST", "PUT", "DELETE"]),
            path: z.string(),
            body: z.string().optional(),
            weight: z
              .number()
              .default(1)
              .describe("Relative frequency of this endpoint"),
          })
        )
        .describe("Endpoints to test"),
      tool: z
        .enum(["k6", "artillery", "autocannon"])
        .default("k6")
        .describe("Load testing tool to generate for"),
      scenarios: z
        .array(z.enum(["smoke", "load", "stress", "spike", "soak"]))
        .default(["smoke", "load"])
        .describe("Test scenarios to include"),
      api_key: z.string().optional(),
    },
    async ({ base_url, endpoints, tool, scenarios, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      const scenarioConfigs = {
        smoke: {
          vus: 1,
          duration: "1m",
          desc: "Verify system works under minimal load",
        },
        load: {
          vus: 50,
          duration: "5m",
          desc: "Normal expected traffic",
        },
        stress: {
          vus: 200,
          duration: "10m",
          desc: "Find breaking point",
        },
        spike: {
          vus: 500,
          duration: "2m",
          desc: "Sudden traffic surge",
        },
        soak: {
          vus: 30,
          duration: "30m",
          desc: "Sustained load for memory leaks",
        },
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_load_test",
                base_url,
                endpoints,
                tool,
                scenarios: scenarios.map((s) => ({
                  name: s,
                  ...scenarioConfigs[s],
                })),
                instructions: `Generate a complete ${tool} load test script that: (1) Tests all ${endpoints.length} endpoints with weighted distribution, (2) Includes ${scenarios.join(", ")} scenarios, (3) Sets thresholds for p95 < 500ms, error rate < 1%, (4) Includes proper auth headers setup, (5) Has custom metrics for each endpoint, (6) Outputs results in JSON format for analysis. Write the script file and a README with run instructions.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 2: Analyze application for performance bottlenecks
  server.tool(
    "perf_analyze_bottlenecks",
    "Scan codebase for common performance anti-patterns and bottlenecks",
    {
      directory: z.string().describe("Project source directory"),
      language: z
        .enum(["typescript", "javascript", "python", "go", "rust", "java"])
        .describe("Primary language"),
      api_key: z.string().optional(),
    },
    async ({ directory, language, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      const antiPatterns: Record<string, string[]> = {
        typescript: [
          "N+1 queries (await inside for/forEach loops)",
          "Missing database indexes (raw queries without EXPLAIN)",
          "Synchronous file I/O (fs.readFileSync in request handlers)",
          "Unbounded array operations (.map/.filter on large datasets)",
          "Missing response caching (repeated identical queries)",
          "Memory leaks (event listeners not cleaned up)",
        ],
        javascript: [
          "N+1 queries (await inside for/forEach loops)",
          "Blocking event loop (CPU-intensive sync operations)",
          "Missing connection pooling",
          "Unoptimized regex patterns",
          "Large JSON.parse/stringify on hot paths",
          "Missing response streaming for large payloads",
        ],
        python: [
          "N+1 queries (queries inside loops)",
          "GIL contention (CPU-bound in async context)",
          "Missing database connection pooling",
          "Inefficient list comprehensions on large datasets",
          "Synchronous I/O in async handlers",
          "Missing caching (repeated computations)",
        ],
        go: [
          "Goroutine leaks (unbounded goroutine creation)",
          "Missing connection pooling",
          "Excessive allocations (string concatenation in loops)",
          "Missing context cancellation propagation",
          "Inefficient JSON marshaling",
          "Missing response buffering",
        ],
        rust: [
          "Unnecessary cloning of large data",
          "Missing connection pooling",
          "Blocking in async context (std::fs in tokio)",
          "Excessive allocations (String vs &str)",
          "Missing zero-copy deserialization",
          "Lock contention (Mutex on hot paths)",
        ],
        java: [
          "N+1 queries (lazy loading in loops)",
          "Missing connection pooling",
          "Excessive object creation (autoboxing)",
          "Synchronized blocks on hot paths",
          "Missing response caching",
          "Inefficient string concatenation",
        ],
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "analyze_bottlenecks",
                directory,
                language,
                patterns_to_check: antiPatterns[language],
                instructions: `Scan the codebase at ${directory} for these ${language} performance anti-patterns: ${antiPatterns[language].join("; ")}. For each pattern found: (1) Show the exact file and line, (2) Explain why it's a bottleneck, (3) Provide a concrete fix. Prioritize by impact (high/medium/low).`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 3: Generate performance budget
  server.tool(
    "perf_create_budget",
    "Create a performance budget configuration with CI/CD enforcement (Pro feature)",
    {
      app_type: z
        .enum(["api", "web-app", "mobile-backend", "microservice"])
        .describe("Type of application"),
      sla_target: z
        .enum(["99.9", "99.95", "99.99"])
        .default("99.9")
        .describe("SLA target percentage"),
      api_key: z.string().optional(),
    },
    async ({ app_type, sla_target, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: "Performance budgets are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
            },
          ],
        };
      }

      const budgets = {
        api: {
          p50_ms: 100,
          p95_ms: 300,
          p99_ms: 1000,
          error_rate: 0.001,
          throughput_rps: 1000,
        },
        "web-app": {
          lcp_ms: 2500,
          fid_ms: 100,
          cls: 0.1,
          ttfb_ms: 800,
          bundle_kb: 250,
        },
        "mobile-backend": {
          p50_ms: 150,
          p95_ms: 500,
          p99_ms: 2000,
          error_rate: 0.0005,
          payload_kb: 100,
        },
        microservice: {
          p50_ms: 50,
          p95_ms: 200,
          p99_ms: 500,
          error_rate: 0.001,
          throughput_rps: 5000,
        },
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_perf_budget",
                app_type,
                sla_target,
                budget: budgets[app_type],
                instructions: `Generate a performance budget configuration for a ${app_type} targeting ${sla_target}% SLA. Include: (1) A perf-budget.json config file with the thresholds above, (2) A GitHub Actions workflow that runs load tests on PR and fails if budget is exceeded, (3) A monitoring dashboard config (Grafana JSON) tracking these metrics, (4) Alert rules for when metrics approach budget limits.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
