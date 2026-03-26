import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerApiDeprecationTools(server: McpServer) {
  server.tool("apidep_scan", "Scan for deprecated API usage", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "apidep_scan", directory, instructions: "Scan for deprecated API usage in the specified directory." }, null, 2) }] };
  });
  server.tool("apidep_generate_warnings", "Generate deprecation warnings", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "apidep_generate_warnings", directory, instructions: "Generate deprecation warnings in the specified directory." }, null, 2) }] };
  });
  server.tool("apidep_migration_guide", "Generate API migration guide (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "apidep_migration_guide", directory, instructions: "Generate API migration guide in the specified directory." }, null, 2) }] };
  });
}
