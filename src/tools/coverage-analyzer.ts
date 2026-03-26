import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCoverageAnalyzerTools(server: McpServer) {
  server.tool(
    "coverage_analyze_gaps",
    "Analyze code coverage data to identify untested code paths and coverage gaps",
    {
      coverage_data: z.string().describe("Coverage report data (lcov, istanbul JSON, or summary text)"),
      source_code: z.string().optional().describe("Source code to correlate with coverage gaps"),
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
                action: "analyze_coverage_gaps",
                instructions:
                  "Parse the provided coverage data and identify uncovered lines, branches, and functions. Prioritize gaps by risk level based on code complexity and criticality. Highlight untested error handling paths, conditional branches, and edge cases. Produce a ranked list of coverage gaps with file locations and suggested test priorities.",
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
    "coverage_suggest_tests",
    "Suggest specific tests to write to improve code coverage based on gap analysis",
    {
      coverage_gaps: z.string().describe("Coverage gap analysis or list of uncovered code sections"),
      source_code: z.string().describe("Source code containing the uncovered sections"),
      framework: z.string().optional().describe("Test framework to use for suggestions"),
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
                action: "suggest_coverage_tests",
                instructions:
                  "Analyze the identified coverage gaps alongside the source code. For each uncovered section, suggest specific test cases that would cover the missing paths. Include test names, input values, expected outputs, and any required mocks. Prioritize suggestions by impact on overall coverage percentage and code risk level.",
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
    "coverage_report",
    "Generate a formatted coverage report with trends and actionable insights (Pro)",
    {
      coverage_data: z.string().describe("Current coverage report data"),
      previous_coverage: z.string().optional().describe("Previous coverage data for trend comparison"),
      threshold: z.number().optional().describe("Target coverage percentage threshold"),
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
                    "This tool requires a Pro subscription. Upgrade to Pro to generate detailed coverage reports with trend analysis, threshold checks, and actionable insights.",
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
                action: "generate_coverage_report",
                instructions:
                  "Generate a comprehensive coverage report including overall metrics (line, branch, function, statement coverage), per-file breakdown, trend comparison with previous data, threshold pass/fail status, and actionable recommendations. Format as a markdown report suitable for CI/CD pipeline output or team review.",
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
