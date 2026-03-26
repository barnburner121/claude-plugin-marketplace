import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerMobilePushTools(server: McpServer) {
  server.tool("mobilepush_setup_fcm", "Set up Firebase Cloud Messaging", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobilepush_setup_fcm", directory, instructions: "Set up Firebase Cloud Messaging in the specified directory." }, null, 2) }] };
  });
  server.tool("mobilepush_add_handling", "Add push notification handling", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobilepush_add_handling", directory, instructions: "Add push notification handling in the specified directory." }, null, 2) }] };
  });
  server.tool("mobilepush_add_deep_linking", "Generate push notification deep linking (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobilepush_add_deep_linking", directory, instructions: "Generate push notification deep linking in the specified directory." }, null, 2) }] };
  });
}
