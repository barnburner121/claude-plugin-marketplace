import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCliProgressTools(server: McpServer) {
  server.tool("cliprogress_generate_bars", "Generate CLI progress bars", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cliprogress_generate_bars", directory, instructions: "Generate CLI progress bars in the specified directory." }, null, 2) }] };
  });
  server.tool("cliprogress_add_spinners", "Add loading spinners", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cliprogress_add_spinners", directory, instructions: "Add loading spinners in the specified directory." }, null, 2) }] };
  });
  server.tool("cliprogress_add_multibar", "Generate multi-progress display (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cliprogress_add_multibar", directory, instructions: "Generate multi-progress display in the specified directory." }, null, 2) }] };
  });
}
