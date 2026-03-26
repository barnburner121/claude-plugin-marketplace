import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerFlakyTestFinderTools(server: McpServer) {
  server.tool(
    "flaky_detect_patterns",
    "Analyze test code to detect common flaky test patterns and anti-patterns",
    {
      test_code: z.string().describe("Test source code to analyze for flaky patterns"),
      framework: z.string().optional().describe("Test framework: 'jest', 'mocha', 'pytest', 'junit', 'playwright'"),
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
                action: "detect_flaky_patterns",
                instructions:
                  "Analyze the provided test code for common flaky test patterns: race conditions, shared mutable state, time-dependent assertions, network dependency without mocking, non-deterministic data, improper async handling, test order dependency, hardcoded timeouts, and missing test isolation. Report each detected pattern with its location, severity, and explanation of why it causes flakiness.",
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
    "flaky_diagnose_root_cause",
    "Diagnose the root cause of a specific flaky test from code and failure logs",
    {
      test_code: z.string().describe("The flaky test source code"),
      failure_logs: z.string().describe("Failure logs or error messages from flaky test runs"),
      source_code: z.string().optional().describe("Source code under test for deeper analysis"),
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
                action: "diagnose_flaky_root_cause",
                instructions:
                  "Analyze the flaky test code alongside its failure logs to identify the root cause of intermittent failures. Examine timing issues, external dependencies, state management, assertion precision, and environmental factors. Cross-reference the test with the source code under test to find race conditions or non-deterministic behavior. Provide a clear diagnosis with evidence from the failure logs.",
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
    "flaky_fix_suggestions",
    "Generate specific code fixes to stabilize flaky tests (Pro)",
    {
      test_code: z.string().describe("The flaky test source code to fix"),
      diagnosis: z.string().describe("Root cause diagnosis of the flaky behavior"),
      framework: z.string().optional().describe("Test framework being used"),
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
                    "This tool requires a Pro subscription. Upgrade to Pro to get specific code fixes and refactored test implementations to stabilize your flaky tests.",
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
                action: "generate_flaky_fixes",
                instructions:
                  "Based on the diagnosis, generate specific code fixes for the flaky test. Provide the corrected test code with proper async handling, deterministic assertions, appropriate mocking, test isolation, and retry strategies where needed. Explain each change and why it addresses the root cause. Include before/after comparisons for clarity.",
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
