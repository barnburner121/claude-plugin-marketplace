import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerUnitTestGenTools(server: McpServer) {
  server.tool(
    "test_generate_unit",
    "Generate unit tests for functions, classes, or modules from source code",
    {
      source_code: z.string().describe("Source code to generate unit tests for"),
      framework: z.string().optional().describe("Test framework: 'jest', 'mocha', 'vitest', 'pytest', 'junit'"),
      language: z.string().optional().describe("Programming language of the source code"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_unit_tests",
                instructions:
                  "Analyze the provided source code and generate comprehensive unit tests. Cover all public functions and methods with tests for expected behavior, return values, and basic error handling. Use the specified test framework conventions and include proper setup/teardown. Organize tests in describe/it blocks with clear test names.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "test_generate_edge_cases",
    "Generate edge case and boundary condition tests for source code",
    {
      source_code: z.string().describe("Source code to generate edge case tests for"),
      framework: z.string().optional().describe("Test framework to use"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_edge_case_tests",
                instructions:
                  "Analyze the provided source code and identify all edge cases, boundary conditions, and potential failure points. Generate tests for null/undefined inputs, empty collections, maximum/minimum values, type coercion issues, concurrent access scenarios, and off-by-one errors. Each test should have a descriptive name explaining the edge case being tested.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "test_generate_mocks",
    "Generate mock objects, stubs, and test fixtures for dependencies (Pro)",
    {
      source_code: z.string().describe("Source code with dependencies to mock"),
      dependencies: z.string().optional().describe("List of dependencies to create mocks for"),
      framework: z.string().optional().describe("Test/mock framework to use"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  action: "upgrade_required",
                  instructions:
                    "This tool requires a Pro subscription. Upgrade to Pro to automatically generate mock objects, stubs, and test fixtures for your dependencies.",
                },
                null,
                2
              ),
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
                action: "generate_mocks",
                instructions:
                  "Analyze the source code to identify all external dependencies (APIs, databases, file system, third-party services). Generate mock implementations that match the interface of each dependency. Include factory functions for creating test fixtures with realistic default data. Provide both simple stubs and configurable mocks with assertion helpers.",
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
