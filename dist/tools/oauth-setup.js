import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerOauthSetupTools(server) {
    server.tool("oauth_generate_flow", "Generate OAuth 2.0 authorization flow", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "oauth_generate_flow", directory, instructions: "Generate OAuth 2.0 authorization flow in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("oauth_setup_providers", "Set up OAuth provider configurations", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "oauth_setup_providers", directory, instructions: "Set up OAuth provider configurations in the specified directory." }, null, 2) }],
        };
    });
    server.tool("oauth_generate_middleware", "Generate OAuth middleware and token validation (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "oauth_generate_middleware", directory, instructions: "Generate OAuth middleware and token validation in the specified directory." }, null, 2) }],
        };
    });
}
