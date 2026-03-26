import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerReactNativeSetupTools(server) {
    server.tool("rn_generate_project", "Generate React Native project structure", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rn_generate_project", directory, instructions: "Generate React Native project structure in the specified directory." }, null, 2) }] };
    });
    server.tool("rn_add_navigation", "Add React Navigation setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rn_add_navigation", directory, instructions: "Add React Navigation setup in the specified directory." }, null, 2) }] };
    });
    server.tool("rn_add_state", "Generate state management for React Native (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "rn_add_state", directory, instructions: "Generate state management for React Native in the specified directory." }, null, 2) }] };
    });
}
