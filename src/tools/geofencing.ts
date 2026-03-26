import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGeofencingTools(server: McpServer) {
  server.tool("geofence_generate_system", "Generate geofencing implementation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "geofence_generate_system", directory, instructions: "Generate geofencing implementation in the specified directory." }, null, 2) }] };
  });
  server.tool("geofence_add_triggers", "Add geofence trigger events", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "geofence_add_triggers", directory, instructions: "Add geofence trigger events in the specified directory." }, null, 2) }] };
  });
  server.tool("geofence_add_monitoring", "Generate geofence monitoring (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "geofence_add_monitoring", directory, instructions: "Generate geofence monitoring in the specified directory." }, null, 2) }] };
  });
}
