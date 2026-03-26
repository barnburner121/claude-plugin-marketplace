import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSloGeneratorTools(server) {
    server.tool("slo_define_objectives", "Generate SLO/SLI definitions", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "slo_define_objectives", directory, instructions: "Generate SLO/SLI definitions in the specified directory." }, null, 2) }] };
    });
    server.tool("slo_calculate_budget", "Calculate error budget", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "slo_calculate_budget", directory, instructions: "Calculate error budget in the specified directory." }, null, 2) }] };
    });
    server.tool("slo_generate_alerts", "Generate SLO-based alerts (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "slo_generate_alerts", directory, instructions: "Generate SLO-based alerts in the specified directory." }, null, 2) }] };
    });
}
