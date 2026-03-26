import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerExperimentTrackerTools(server: McpServer) {
  server.tool("exp_setup_tracking", "Set up experiment tracking with MLflow", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "exp_setup_tracking", directory, instructions: "Set up experiment tracking with MLflow in the specified directory." }, null, 2) }] };
  });
  server.tool("exp_add_metrics", "Add custom metric tracking", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "exp_add_metrics", directory, instructions: "Add custom metric tracking in the specified directory." }, null, 2) }] };
  });
  server.tool("exp_generate_reports", "Generate experiment comparison reports (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "exp_generate_reports", directory, instructions: "Generate experiment comparison reports in the specified directory." }, null, 2) }] };
  });
}
