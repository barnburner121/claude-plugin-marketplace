import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerMobileAuthTools(server: McpServer) {
  server.tool("mobileauth_generate_flow", "Generate mobile authentication flow", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobileauth_generate_flow", directory, instructions: "Generate mobile authentication flow in the specified directory." }, null, 2) }] };
  });
  server.tool("mobileauth_add_biometric", "Add biometric authentication", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobileauth_add_biometric", directory, instructions: "Add biometric authentication in the specified directory." }, null, 2) }] };
  });
  server.tool("mobileauth_add_token_storage", "Generate secure token storage (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobileauth_add_token_storage", directory, instructions: "Generate secure token storage in the specified directory." }, null, 2) }] };
  });
}
