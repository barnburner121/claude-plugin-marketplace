import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerVectorDbTools(server: McpServer) {
  server.tool("vectordb_setup", "Set up vector database integration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "vectordb_setup", directory, instructions: "Set up vector database integration in the specified directory." }, null, 2) }] };
  });
  server.tool("vectordb_generate_index", "Generate vector index configurations", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "vectordb_generate_index", directory, instructions: "Generate vector index configurations in the specified directory." }, null, 2) }] };
  });
  server.tool("vectordb_optimize_search", "Optimize vector search performance (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "vectordb_optimize_search", directory, instructions: "Optimize vector search performance in the specified directory." }, null, 2) }] };
  });
}
