import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerTsconfigGenTools(server) {
    server.tool("tsconfig_generate", "Generate TypeScript configuration for project type", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "tsconfig_generate", directory, instructions: "Generate TypeScript configuration for project type in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("tsconfig_strict_mode", "Enable strict mode with proper settings", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "tsconfig_strict_mode", directory, instructions: "Enable strict mode with proper settings in the specified directory." }, null, 2) }],
        };
    });
    server.tool("tsconfig_path_aliases", "Set up path aliases and project references (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "tsconfig_path_aliases", directory, instructions: "Set up path aliases and project references in the specified directory." }, null, 2) }],
        };
    });
}
