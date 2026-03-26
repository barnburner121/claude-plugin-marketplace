import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerSseSetupTools(server: McpServer) {
  server.tool("sse_generate_server", "Generate Server-Sent Events server", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "sse_generate_server", directory, instructions: "Generate Server-Sent Events server in the specified directory." }, null, 2) }] };
  });
  server.tool("sse_generate_client", "Generate SSE client with reconnection", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "sse_generate_client", directory, instructions: "Generate SSE client with reconnection in the specified directory." }, null, 2) }] };
  });
  server.tool("sse_add_auth", "Add authentication to SSE streams (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "sse_add_auth", directory, instructions: "Add authentication to SSE streams in the specified directory." }, null, 2) }] };
  });
}
