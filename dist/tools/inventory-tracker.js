import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerInventoryTrackerTools(server) {
    server.tool("inv_generate_system", "Generate inventory tracking system", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "inv_generate_system", directory, instructions: "Generate inventory tracking system in the specified directory." }, null, 2) }] };
    });
    server.tool("inv_add_alerts", "Add low stock alerts", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "inv_add_alerts", directory, instructions: "Add low stock alerts in the specified directory." }, null, 2) }] };
    });
    server.tool("inv_add_forecasting", "Generate inventory forecasting (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "inv_add_forecasting", directory, instructions: "Generate inventory forecasting in the specified directory." }, null, 2) }] };
    });
}
