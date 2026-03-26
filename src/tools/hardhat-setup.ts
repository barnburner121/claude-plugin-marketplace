import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerHardhatSetupTools(server: McpServer) {
  server.tool("hardhat_generate_project", "Generate Hardhat development environment", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "hardhat_generate_project", directory, instructions: "Generate Hardhat development environment in the specified directory." }, null, 2) }] };
  });
  server.tool("hardhat_add_tests", "Add smart contract test setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "hardhat_add_tests", directory, instructions: "Add smart contract test setup in the specified directory." }, null, 2) }] };
  });
  server.tool("hardhat_add_deployment", "Generate deployment scripts (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "hardhat_add_deployment", directory, instructions: "Generate deployment scripts in the specified directory." }, null, 2) }] };
  });
}
