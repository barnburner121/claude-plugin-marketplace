import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerReferralSystemTools(server: McpServer) {
  server.tool("referral_generate_system", "Generate referral tracking system", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "referral_generate_system", directory, instructions: "Generate referral tracking system in the specified directory." }, null, 2) }] };
  });
  server.tool("referral_add_rewards", "Add reward calculation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "referral_add_rewards", directory, instructions: "Add reward calculation in the specified directory." }, null, 2) }] };
  });
  server.tool("referral_add_analytics", "Generate referral analytics (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "referral_add_analytics", directory, instructions: "Generate referral analytics in the specified directory." }, null, 2) }] };
  });
}
