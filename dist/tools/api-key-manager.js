import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerApiKeyManagerTools(server) {
    server.tool("apikey_generate_system", "Generate API key creation and management", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "apikey_generate_system", directory, instructions: "Generate API key creation and management in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("apikey_add_scoping", "Add scope-based API key permissions", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "apikey_add_scoping", directory, instructions: "Add scope-based API key permissions in the specified directory." }, null, 2) }],
        };
    });
    server.tool("apikey_add_rotation", "Generate API key rotation system (Pro feature)", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }],
            };
        }
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "apikey_add_rotation", directory, instructions: "Generate API key rotation system in the specified directory." }, null, 2) }],
        };
    });
}
