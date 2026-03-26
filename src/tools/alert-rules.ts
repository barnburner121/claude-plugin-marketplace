import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerAlertRulesTools(server: McpServer) {
  server.tool(
    "alert_generate_prometheus",
    "Generate Prometheus alerting rules",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "alert_generate_prometheus", directory, instructions: "Generate Prometheus alerting rules in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
      };
    }
  );

  server.tool(
    "alert_generate_pagerduty",
    "Generate PagerDuty integration and escalation",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "alert_generate_pagerduty", directory, instructions: "Generate PagerDuty integration and escalation in the specified directory." }, null, 2) }],
      };
    }
  );

  server.tool(
    "alert_generate_runbooks",
    "Generate alert response runbooks (Pro feature)",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier === "free") {
        return {
          content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }],
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "alert_generate_runbooks", directory, instructions: "Generate alert response runbooks in the specified directory." }, null, 2) }],
      };
    }
  );
}
