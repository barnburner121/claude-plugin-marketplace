import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerSearchIndexTools(server: McpServer) {
  server.tool("searchidx_setup", "Generate search indexing setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "searchidx_setup", directory, instructions: "Generate search indexing setup in the specified directory." }, null, 2) }] };
  });
  server.tool("searchidx_add_autocomplete", "Add search autocomplete", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "searchidx_add_autocomplete", directory, instructions: "Add search autocomplete in the specified directory." }, null, 2) }] };
  });
  server.tool("searchidx_optimize", "Optimize search relevance (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "searchidx_optimize", directory, instructions: "Optimize search relevance in the specified directory." }, null, 2) }] };
  });
}
