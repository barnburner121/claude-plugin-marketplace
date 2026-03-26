import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWebsocketAuthTools(server) {
    server.tool("wsauth_generate", "Generate WebSocket authentication", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "wsauth_generate", directory, instructions: "Generate WebSocket authentication in the specified directory." }, null, 2) }] };
    });
    server.tool("wsauth_add_tokens", "Add token-based WS auth", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "wsauth_add_tokens", directory, instructions: "Add token-based WS auth in the specified directory." }, null, 2) }] };
    });
    server.tool("wsauth_add_reconnect", "Generate authenticated reconnection (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "wsauth_add_reconnect", directory, instructions: "Generate authenticated reconnection in the specified directory." }, null, 2) }] };
    });
}
