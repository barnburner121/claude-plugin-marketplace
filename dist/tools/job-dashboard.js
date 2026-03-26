import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerJobDashboardTools(server) {
    server.tool("jobdash_generate_ui", "Generate job monitoring dashboard", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "jobdash_generate_ui", directory, instructions: "Generate job monitoring dashboard in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("jobdash_add_metrics", "Add job performance metrics", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "jobdash_add_metrics", directory, instructions: "Add job performance metrics in the specified directory." }, null, 2) }],
        };
    });
    server.tool("jobdash_add_alerts", "Generate job failure alerting (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "jobdash_add_alerts", directory, instructions: "Generate job failure alerting in the specified directory." }, null, 2) }],
        };
    });
}
