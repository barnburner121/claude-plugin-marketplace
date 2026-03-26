import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCliPromptsTools(server: McpServer) {
  server.tool("cliprompt_generate_wizard", "Generate interactive CLI wizard", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cliprompt_generate_wizard", directory, instructions: "Generate interactive CLI wizard in the specified directory." }, null, 2) }] };
  });
  server.tool("cliprompt_add_validation", "Add input validation to prompts", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cliprompt_add_validation", directory, instructions: "Add input validation to prompts in the specified directory." }, null, 2) }] };
  });
  server.tool("cliprompt_add_themes", "Generate themed CLI prompts (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "cliprompt_add_themes", directory, instructions: "Generate themed CLI prompts in the specified directory." }, null, 2) }] };
  });
}
