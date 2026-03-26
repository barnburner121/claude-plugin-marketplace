import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCalendarIntegrationTools(server: McpServer) {
  server.tool("cal_setup_api", "Set up calendar API integration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cal_setup_api", directory, instructions: "Set up calendar API integration in the specified directory." }, null, 2) }] };
  });
  server.tool("cal_add_sync", "Add calendar sync functionality", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cal_add_sync", directory, instructions: "Add calendar sync functionality in the specified directory." }, null, 2) }] };
  });
  server.tool("cal_generate_ui", "Generate calendar UI components (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cal_generate_ui", directory, instructions: "Generate calendar UI components in the specified directory." }, null, 2) }] };
  });
}
