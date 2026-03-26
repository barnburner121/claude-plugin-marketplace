import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCorsMiddlewareTools(server: McpServer) {
  server.tool("cors_generate_middleware", "Generate CORS middleware", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cors_generate_middleware", directory, instructions: "Generate CORS middleware in the specified directory." }, null, 2) }] };
  });
  server.tool("cors_analyze_config", "Analyze CORS configuration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cors_analyze_config", directory, instructions: "Analyze CORS configuration in the specified directory." }, null, 2) }] };
  });
  server.tool("cors_generate_policy", "Generate CORS policy documentation (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cors_generate_policy", directory, instructions: "Generate CORS policy documentation in the specified directory." }, null, 2) }] };
  });
}
