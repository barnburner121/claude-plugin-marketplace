import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerMobileCiTools(server: McpServer) {
  server.tool("mobileci_setup_fastlane", "Set up Fastlane for mobile CI/CD", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobileci_setup_fastlane", directory, instructions: "Set up Fastlane for mobile CI/CD in the specified directory." }, null, 2) }] };
  });
  server.tool("mobileci_add_signing", "Add code signing configuration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobileci_add_signing", directory, instructions: "Add code signing configuration in the specified directory." }, null, 2) }] };
  });
  server.tool("mobileci_add_deployment", "Generate app store deployment pipeline (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "mobileci_add_deployment", directory, instructions: "Generate app store deployment pipeline in the specified directory." }, null, 2) }] };
  });
}
