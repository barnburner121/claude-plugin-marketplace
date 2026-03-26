import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerDuplicationHunterTools(server: McpServer) {
  server.tool(
    "dup_find_similar_blocks",
    "Find similar code blocks across the codebase that could be consolidated",
    {
      directory: z.string().describe("Project directory to scan"),
      min_lines: z.number().default(5).describe("Minimum lines for a block to be considered"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, min_lines, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "find_similar_blocks",
            directory,
            min_lines,
            instructions: `Search the codebase for structurally similar code blocks of ${min_lines}+ lines. Look for: (1) Functions with identical logic but different variable names, (2) Repeated conditional blocks (if/else chains with same structure), (3) Similar error handling patterns duplicated across files, (4) Repeated data transformation pipelines (map/filter/reduce chains). For each group of duplicates, show all locations and highlight the common pattern that could be extracted into a shared utility function.`,
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "dup_find_copy_paste",
    "Detect exact or near-exact copy-paste code across files",
    {
      directory: z.string().describe("Project directory to scan"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "find_copy_paste",
            directory,
            instructions: "Find copy-pasted code by searching for: (1) Identical multi-line blocks appearing in 2+ files (search for distinctive lines and check if surrounding code also matches), (2) Functions with the same name defined in multiple files, (3) Similar API endpoint handlers with duplicated validation/response logic, (4) Repeated configuration objects or constant arrays. For each duplicate group, report all file locations, the duplicated code, and whether they have diverged (slight modifications suggesting copy-paste-modify).",
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "dup_suggest_extraction",
    "Suggest how to extract duplicated code into shared utilities (Pro feature)",
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
            text: "Extraction suggestions are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
          }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "suggest_extraction",
            directory,
            instructions: "Run both duplication scans, then for each group of duplicates: (1) Identify the common pattern and the variable parts, (2) Design a shared function/class that accepts the variable parts as parameters, (3) Show the proposed shared utility code, (4) Show how each call site would be refactored to use it, (5) Suggest where to place the shared code (utils/, shared/, lib/). Provide ready-to-apply Edit commands for the top extractions.",
          }, null, 2),
        }],
      };
    }
  );
}
