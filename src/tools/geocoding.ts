import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGeocodingTools(server: McpServer) {
  server.tool("geo_setup_provider", "Set up geocoding provider integration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "geo_setup_provider", directory, instructions: "Set up geocoding provider integration in the specified directory." }, null, 2) }] };
  });
  server.tool("geo_add_reverse", "Add reverse geocoding", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "geo_add_reverse", directory, instructions: "Add reverse geocoding in the specified directory." }, null, 2) }] };
  });
  server.tool("geo_add_batch", "Generate batch geocoding pipeline (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "geo_add_batch", directory, instructions: "Generate batch geocoding pipeline in the specified directory." }, null, 2) }] };
  });
}
