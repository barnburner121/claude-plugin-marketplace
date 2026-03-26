import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerComplexityReducerTools(server: McpServer) {
  server.tool(
    "complexity_analyze",
    "Analyze cyclomatic complexity of functions and identify overly complex code",
    {
      directory: z.string().describe("Project directory to analyze"),
      threshold: z.number().default(10).describe("Complexity threshold to flag"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, threshold, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "analyze_complexity",
            directory,
            threshold,
            instructions: `Analyze each function in the codebase for cyclomatic complexity by counting decision points: if, else if, case, &&, ||, ternary (?:), catch, while, for, for...of, for...in. Each adds 1 to the base complexity of 1. Flag functions exceeding ${threshold}. Also check for: (1) Deeply nested conditionals (3+ levels), (2) Long switch statements (10+ cases), (3) Complex boolean expressions with many operators. Report each function with its complexity score, file path, and line number, sorted by complexity descending.`,
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "complexity_suggest_simplifications",
    "Suggest specific refactoring strategies to reduce complexity",
    {
      file_path: z.string().describe("File with complex code to simplify"),
      function_name: z.string().optional().describe("Specific function to simplify"),
      api_key: z.string().optional(),
    },
    async ({ file_path, function_name, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "suggest_simplifications",
            file_path,
            function_name: function_name || "all",
            instructions: "Read the file and analyze complex functions. For each, suggest specific simplification strategies: (1) Replace nested if/else with early returns (guard clauses), (2) Replace switch statements with lookup maps/objects, (3) Extract complex boolean conditions into named variables, (4) Replace loops with array methods (map, filter, reduce), (5) Extract nested logic into helper functions, (6) Use the strategy pattern for multiple similar branches, (7) Apply polymorphism to replace type-checking conditionals. Provide before/after code for each suggestion.",
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "complexity_report",
    "Generate a full complexity analysis report with trends (Pro feature)",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      if (tier === "free") {
        return {
          content: [{
            type: "text" as const,
            text: "Complexity reports are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
          }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "complexity_report",
            directory,
            instructions: "Analyze the entire codebase for complexity and generate a report: (1) Overall complexity score and distribution (how many functions at each complexity level), (2) Top 10 most complex functions with scores, (3) Hotspot files (files with the most complex functions), (4) Average complexity per directory/module, (5) Specific simplification recommendations for the top 5 most complex functions with refactored code, (6) Estimated effort to bring all functions under complexity threshold of 10.",
          }, null, 2),
        }],
      };
    }
  );
}
