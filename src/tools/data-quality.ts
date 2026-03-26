import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerDataQualityTools(server: McpServer) {
  server.tool("dq_generate_checks", "Generate data quality validation checks", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "dq_generate_checks", directory, instructions: "Generate data quality validation checks in the specified directory." }, null, 2) }] };
  });
  server.tool("dq_add_monitoring", "Add data quality monitoring", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "dq_add_monitoring", directory, instructions: "Add data quality monitoring in the specified directory." }, null, 2) }] };
  });
  server.tool("dq_generate_reports", "Generate data quality reports (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "dq_generate_reports", directory, instructions: "Generate data quality reports in the specified directory." }, null, 2) }] };
  });
}
