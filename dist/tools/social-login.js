import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSocialLoginTools(server) {
    server.tool("social_setup_google", "Generate Google OAuth login integration", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "social_setup_google", directory, instructions: "Generate Google OAuth login integration in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("social_setup_github", "Generate GitHub OAuth login integration", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "social_setup_github", directory, instructions: "Generate GitHub OAuth login integration in the specified directory." }, null, 2) }],
        };
    });
    server.tool("social_setup_multi", "Set up multi-provider social login (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "social_setup_multi", directory, instructions: "Set up multi-provider social login in the specified directory." }, null, 2) }],
        };
    });
}
