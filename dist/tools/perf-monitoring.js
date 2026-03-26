import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPerfMonitoringTools(server) {
    server.tool("perfmon_setup", "Set up real-time performance monitoring", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "perfmon_setup", directory, instructions: "Set up real-time performance monitoring in the specified directory." }, null, 2) }] };
    });
    server.tool("perfmon_add_alerts", "Add performance threshold alerts", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "perfmon_add_alerts", directory, instructions: "Add performance threshold alerts in the specified directory." }, null, 2) }] };
    });
    server.tool("perfmon_generate_dashboard", "Generate performance dashboard (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "perfmon_generate_dashboard", directory, instructions: "Generate performance dashboard in the specified directory." }, null, 2) }] };
    });
}
