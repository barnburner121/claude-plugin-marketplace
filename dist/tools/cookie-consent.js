import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCookieConsentTools(server) {
    server.tool("cookie_generate_banner", "Generate cookie consent banner", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "cookie_generate_banner", directory, instructions: "Generate cookie consent banner in the specified directory." }, null, 2) }] };
    });
    server.tool("cookie_add_preferences", "Add cookie preference management", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "cookie_add_preferences", directory, instructions: "Add cookie preference management in the specified directory." }, null, 2) }] };
    });
    server.tool("cookie_generate_policy", "Generate cookie policy documentation (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "cookie_generate_policy", directory, instructions: "Generate cookie policy documentation in the specified directory." }, null, 2) }] };
    });
}
