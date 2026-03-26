import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerTechDebtTrackerTools(server: McpServer) {
  server.tool(
    "debt_scan_todos",
    "Scan codebase for TODO, FIXME, HACK, and other tech debt markers",
    {
      directory: z.string().describe("Project directory to scan"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      const markers = [
        { name: "TODO", severity: "medium", pattern: "TODO[:\\s]" },
        { name: "FIXME", severity: "high", pattern: "FIXME[:\\s]" },
        { name: "HACK", severity: "high", pattern: "HACK[:\\s]" },
        { name: "WORKAROUND", severity: "medium", pattern: "WORKAROUND[:\\s]" },
        { name: "TEMP", severity: "medium", pattern: "TEMP[:\\s]|TEMPORARY[:\\s]" },
        { name: "DEPRECATED", severity: "low", pattern: "@deprecated|DEPRECATED[:\\s]" },
        { name: "XXX", severity: "high", pattern: "XXX[:\\s]" },
        { name: "BUG", severity: "critical", pattern: "BUG[:\\s]" },
      ];

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "scan_todos",
            directory,
            markers,
            instructions: "Search the codebase for each tech debt marker using Grep. For each match, extract: (1) The marker type and severity, (2) File path and line number, (3) The full comment text describing the issue, (4) Any associated author or date if present. Group results by severity (critical, high, medium, low), then by marker type. Show total counts per category and a summary of the most urgent items.",
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "debt_prioritize",
    "Analyze and prioritize tech debt items by impact and effort",
    {
      directory: z.string().describe("Project directory to analyze"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "prioritize_debt",
            directory,
            instructions: "Scan for all tech debt markers and then prioritize them: (1) Assess impact - is the debt in a hot path (frequently modified file)? Is it in critical infrastructure (auth, payments, data layer)? Does it block other work? (2) Assess effort - is it a quick fix (minutes), moderate (hours), or large refactor (days)? (3) Create a priority matrix: Quick Wins (high impact, low effort) first, then Strategic (high impact, high effort), then Fill-ins (low impact, low effort), then Deprioritize (low impact, high effort). Output a ranked list with estimated effort and suggested sprint assignments.",
          }, null, 2),
        }],
      };
    }
  );

  server.tool(
    "debt_generate_report",
    "Generate a comprehensive tech debt report with metrics (Pro feature)",
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
            text: "Tech debt reports are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
          }],
        };
      }

      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            action: "debt_report",
            directory,
            instructions: "Generate a full tech debt report: (1) Total debt items by category and severity, (2) Debt density (items per 1000 lines of code), (3) Hotspot analysis (files/directories with the most debt), (4) Debt age estimation from git blame on TODO comments, (5) Dependency debt (outdated packages from package.json/requirements.txt), (6) Test debt (files with low or no test coverage), (7) Documentation debt (exported functions without JSDoc/docstrings), (8) Prioritized remediation roadmap with effort estimates. Format as a structured report with charts-ready data.",
          }, null, 2),
        }],
      };
    }
  );
}
