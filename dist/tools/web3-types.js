import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWeb3TypesTools(server) {
    server.tool("w3types_from_abi", "Generate TypeScript types from ABI", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "w3types_from_abi", directory, instructions: "Generate TypeScript types from ABI in the specified directory." }, null, 2) }] };
    });
    server.tool("w3types_generate_hooks", "Generate React hooks for contracts", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "w3types_generate_hooks", directory, instructions: "Generate React hooks for contracts in the specified directory." }, null, 2) }] };
    });
    server.tool("w3types_add_validation", "Generate contract interaction validation (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "w3types_add_validation", directory, instructions: "Generate contract interaction validation in the specified directory." }, null, 2) }] };
    });
}
