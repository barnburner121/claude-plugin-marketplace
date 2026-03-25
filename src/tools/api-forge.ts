import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerApiForgeTools(server: McpServer) {
  // Tool 1: Generate API test suite from OpenAPI spec or route files
  server.tool(
    "api_generate_tests",
    "Generate comprehensive API test suite from OpenAPI spec, route definitions, or endpoint patterns",
    {
      source: z
        .string()
        .describe(
          "Path to OpenAPI spec file, routes file, or directory to scan"
        ),
      framework: z
        .enum(["vitest", "jest", "mocha", "pytest", "go-test"])
        .default("vitest")
        .describe("Test framework to generate for"),
      api_key: z.string().optional(),
    },
    async ({ source, framework, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_api_tests",
                source,
                framework,
                instructions: `Read the source file/directory. Identify all API endpoints (routes, handlers, controllers). For each endpoint, generate tests covering: (1) Happy path with valid data, (2) Validation errors with invalid input, (3) Auth failures (401/403), (4) Not found (404), (5) Edge cases. Use ${framework} syntax. Include setup/teardown for test database or mocks.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 2: Create mock API server from spec
  server.tool(
    "api_create_mock",
    "Generate a mock API server that returns realistic fake data matching your API schema",
    {
      spec_path: z
        .string()
        .describe("Path to OpenAPI spec or route definitions"),
      port: z.number().default(4000).describe("Port for mock server"),
      api_key: z.string().optional(),
    },
    async ({ spec_path, port, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_mock_server",
                spec_path,
                port,
                instructions:
                  "Read the spec file. Generate a standalone Express/Fastify mock server that: (1) Implements every endpoint from the spec, (2) Returns realistic fake data using faker-like patterns, (3) Validates request bodies against the schema, (4) Simulates proper HTTP status codes, (5) Includes configurable latency for testing timeouts. Write to mock-server.ts in the project root.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 3: Contract testing between services
  server.tool(
    "api_contract_test",
    "Verify API contract compatibility between a provider spec and consumer expectations (Pro feature)",
    {
      provider_spec: z
        .string()
        .describe("Path to provider OpenAPI spec"),
      consumer_spec: z
        .string()
        .describe("Path to consumer expectations (OpenAPI or Pact file)"),
      api_key: z.string().optional(),
    },
    async ({ provider_spec, consumer_spec, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: "Contract testing is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "contract_test",
                provider_spec,
                consumer_spec,
                instructions:
                  "Read both spec files. Compare: (1) All endpoints the consumer expects exist in the provider, (2) Request schemas are compatible (consumer sends what provider accepts), (3) Response schemas are compatible (provider returns what consumer expects), (4) Required fields aren't missing, (5) Type changes that would break the consumer. Output a compatibility report with breaking/non-breaking changes.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 4: API performance baseline
  server.tool(
    "api_benchmark",
    "Create a performance benchmark configuration for API endpoints",
    {
      endpoints: z
        .array(
          z.object({
            method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
            url: z.string(),
            body: z.string().optional(),
            headers: z.record(z.string()).optional(),
          })
        )
        .describe("List of endpoints to benchmark"),
      duration_seconds: z.number().default(30),
      concurrent_users: z.number().default(10),
      api_key: z.string().optional(),
    },
    async ({ endpoints, duration_seconds, concurrent_users, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "benchmark_api",
                endpoints,
                config: {
                  duration_seconds,
                  concurrent_users,
                  ramp_up_seconds: Math.ceil(duration_seconds / 6),
                },
                instructions: `Generate a k6 or autocannon benchmark script that: (1) Tests each endpoint with ${concurrent_users} concurrent users over ${duration_seconds}s, (2) Records p50/p95/p99 latencies, (3) Tracks error rates, (4) Reports throughput (req/sec), (5) Generates a summary report. Write the script and include instructions to run it.`,
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
