import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerBookingSystemTools(server: McpServer) {
  server.tool("booking_generate_system", "Generate booking/reservation system", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "booking_generate_system", directory, instructions: "Generate booking/reservation system in the specified directory." }, null, 2) }] };
  });
  server.tool("booking_add_availability", "Add availability management", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "booking_add_availability", directory, instructions: "Add availability management in the specified directory." }, null, 2) }] };
  });
  server.tool("booking_add_reminders", "Generate booking reminders (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "booking_add_reminders", directory, instructions: "Generate booking reminders in the specified directory." }, null, 2) }] };
  });
}
