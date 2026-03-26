import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPrometheusConfigTools(server: McpServer) {
  server.tool("prom_generate_config", "Generate Prometheus scrape config", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "prom_generate_config", directory, instructions: "Generate Prometheus scrape config in the specified directory." }, null, 2) }] };
  });
  server.tool("prom_add_rules", "Add recording and alerting rules", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "prom_add_rules", directory, instructions: "Add recording and alerting rules in the specified directory." }, null, 2) }] };
  });
  server.tool("prom_generate_dashboards", "Generate Grafana dashboards from metrics (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "prom_generate_dashboards", directory, instructions: "Generate Grafana dashboards from metrics in the specified directory." }, null, 2) }] };
  });
}
