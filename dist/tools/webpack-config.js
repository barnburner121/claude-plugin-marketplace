import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWebpackConfigTools(server) {
    server.tool("webpack_generate_config", "Generate Webpack configuration with loaders and plugins", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "webpack_generate_config", directory, instructions: "Generate Webpack configuration with loaders and plugins in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("webpack_add_optimization", "Add optimization settings to Webpack config", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "webpack_add_optimization", directory, instructions: "Add optimization settings to Webpack config in the specified directory." }, null, 2) }],
        };
    });
    server.tool("webpack_analyze_bundle", "Analyze Webpack bundle and suggest optimizations (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "webpack_analyze_bundle", directory, instructions: "Analyze Webpack bundle and suggest optimizations in the specified directory." }, null, 2) }],
        };
    });
}
