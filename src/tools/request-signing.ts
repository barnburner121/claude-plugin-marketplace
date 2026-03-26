import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerRequestSigningTools(server: McpServer) {
  server.tool("reqsign_generate_hmac", "Generate HMAC request signing", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "reqsign_generate_hmac", directory, instructions: "Generate HMAC request signing in the specified directory." }, null, 2) }] };
  });
  server.tool("reqsign_generate_aws", "Generate AWS Signature V4", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "reqsign_generate_aws", directory, instructions: "Generate AWS Signature V4 in the specified directory." }, null, 2) }] };
  });
  server.tool("reqsign_add_verification", "Generate signature verification (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "reqsign_add_verification", directory, instructions: "Generate signature verification in the specified directory." }, null, 2) }] };
  });
}
