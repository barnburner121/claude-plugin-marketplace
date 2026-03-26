import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerTimezoneHandlerTools(server) {
    server.tool("tz_setup_handling", "Set up timezone handling utilities", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "tz_setup_handling", directory, instructions: "Set up timezone handling utilities in the specified directory." }, null, 2) }] };
    });
    server.tool("tz_add_conversion", "Add timezone conversion", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "tz_add_conversion", directory, instructions: "Add timezone conversion in the specified directory." }, null, 2) }] };
    });
    server.tool("tz_add_scheduling", "Generate timezone-aware scheduling (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "tz_add_scheduling", directory, instructions: "Generate timezone-aware scheduling in the specified directory." }, null, 2) }] };
    });
}
