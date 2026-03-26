import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerExpoSetupTools(server) {
    server.tool("expo_generate_project", "Generate Expo managed project", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "expo_generate_project", directory, instructions: "Generate Expo managed project in the specified directory." }, null, 2) }] };
    });
    server.tool("expo_add_config", "Add Expo configuration plugins", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "expo_add_config", directory, instructions: "Add Expo configuration plugins in the specified directory." }, null, 2) }] };
    });
    server.tool("expo_setup_eas", "Set up EAS Build and Submit (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "expo_setup_eas", directory, instructions: "Set up EAS Build and Submit in the specified directory." }, null, 2) }] };
    });
}
