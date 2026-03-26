import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerEncryptionSetupTools(server: McpServer) {
  server.tool("encrypt_setup_atrest", "Generate encryption at rest setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "encrypt_setup_atrest", directory, instructions: "Generate encryption at rest setup in the specified directory." }, null, 2) }] };
  });
  server.tool("encrypt_setup_intransit", "Generate encryption in transit", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "encrypt_setup_intransit", directory, instructions: "Generate encryption in transit in the specified directory." }, null, 2) }] };
  });
  server.tool("encrypt_key_management", "Generate key management system (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "encrypt_key_management", directory, instructions: "Generate key management system in the specified directory." }, null, 2) }] };
  });
}
