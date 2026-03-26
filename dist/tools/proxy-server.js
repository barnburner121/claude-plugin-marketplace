import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerProxyServerTools(server) {
    server.tool("proxy_generate_server", "Generate proxy server implementation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "proxy_generate_server", directory, instructions: "Generate proxy server implementation in the specified directory." }, null, 2) }] };
    });
    server.tool("proxy_add_caching", "Add proxy caching layer", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "proxy_add_caching", directory, instructions: "Add proxy caching layer in the specified directory." }, null, 2) }] };
    });
    server.tool("proxy_add_routing", "Generate proxy routing rules (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "proxy_add_routing", directory, instructions: "Generate proxy routing rules in the specified directory." }, null, 2) }] };
    });
}
