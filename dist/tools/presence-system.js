import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPresenceSystemTools(server) {
    server.tool("presence_generate_server", "Generate user presence tracking server", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "presence_generate_server", directory, instructions: "Generate user presence tracking server in the specified directory." }, null, 2) }] };
    });
    server.tool("presence_generate_client", "Generate presence client SDK", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "presence_generate_client", directory, instructions: "Generate presence client SDK in the specified directory." }, null, 2) }] };
    });
    server.tool("presence_add_channels", "Generate channel-based presence (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "presence_add_channels", directory, instructions: "Generate channel-based presence in the specified directory." }, null, 2) }] };
    });
}
