import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPostmortemGenTools(server: McpServer) {
  server.tool("postmortem_create_template", "Generate post-incident review template", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "postmortem_create_template", directory, instructions: "Generate post-incident review template in the specified directory." }, null, 2) }] };
  });
  server.tool("postmortem_analyze_timeline", "Generate incident timeline analysis", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "postmortem_analyze_timeline", directory, instructions: "Generate incident timeline analysis in the specified directory." }, null, 2) }] };
  });
  server.tool("postmortem_track_actions", "Generate action item tracking (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "postmortem_track_actions", directory, instructions: "Generate action item tracking in the specified directory." }, null, 2) }] };
  });
}
