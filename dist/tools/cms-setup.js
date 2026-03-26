import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCmsSetupTools(server) {
    server.tool("cms_setup_headless", "Set up headless CMS integration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "cms_setup_headless", directory, instructions: "Set up headless CMS integration in the specified directory." }, null, 2) }] };
    });
    server.tool("cms_generate_types", "Generate TypeScript types from CMS schema", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "cms_generate_types", directory, instructions: "Generate TypeScript types from CMS schema in the specified directory." }, null, 2) }] };
    });
    server.tool("cms_add_preview", "Generate content preview setup (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "cms_add_preview", directory, instructions: "Generate content preview setup in the specified directory." }, null, 2) }] };
    });
}
