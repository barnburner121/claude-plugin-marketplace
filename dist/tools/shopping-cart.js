import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerShoppingCartTools(server) {
    server.tool("cart_generate_system", "Generate shopping cart implementation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "cart_generate_system", directory, instructions: "Generate shopping cart implementation in the specified directory." }, null, 2) }] };
    });
    server.tool("cart_add_persistence", "Add cart persistence and sync", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "cart_add_persistence", directory, instructions: "Add cart persistence and sync in the specified directory." }, null, 2) }] };
    });
    server.tool("cart_add_promotions", "Generate cart promotion engine (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "cart_add_promotions", directory, instructions: "Generate cart promotion engine in the specified directory." }, null, 2) }] };
    });
}
