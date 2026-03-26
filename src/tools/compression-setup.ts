import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCompressionSetupTools(server: McpServer) {
  server.tool("compress_setup_gzip", "Set up gzip/brotli compression", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "compress_setup_gzip", directory, instructions: "Set up gzip/brotli compression in the specified directory." }, null, 2) }] };
  });
  server.tool("compress_add_static", "Add static asset compression", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "compress_add_static", directory, instructions: "Add static asset compression in the specified directory." }, null, 2) }] };
  });
  server.tool("compress_optimize", "Optimize compression settings (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "compress_optimize", directory, instructions: "Optimize compression settings in the specified directory." }, null, 2) }] };
  });
}
