import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerGrafanaDashboardTools(server) {
    server.tool("grafana_generate_dashboard", "Generate Grafana dashboard JSON", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "grafana_generate_dashboard", directory, instructions: "Generate Grafana dashboard JSON in the specified directory." }, null, 2) }] };
    });
    server.tool("grafana_add_panels", "Add dashboard panels and variables", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "grafana_add_panels", directory, instructions: "Add dashboard panels and variables in the specified directory." }, null, 2) }] };
    });
    server.tool("grafana_add_alerts", "Generate Grafana alert rules (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "grafana_add_alerts", directory, instructions: "Generate Grafana alert rules in the specified directory." }, null, 2) }] };
    });
}
