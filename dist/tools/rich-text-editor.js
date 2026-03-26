import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRichTextEditorTools(server) {
    server.tool("rte_setup_editor", "Set up rich text editor integration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rte_setup_editor", directory, instructions: "Set up rich text editor integration in the specified directory." }, null, 2) }] };
    });
    server.tool("rte_add_plugins", "Add editor plugins and extensions", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rte_add_plugins", directory, instructions: "Add editor plugins and extensions in the specified directory." }, null, 2) }] };
    });
    server.tool("rte_generate_renderer", "Generate content renderer (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "rte_generate_renderer", directory, instructions: "Generate content renderer in the specified directory." }, null, 2) }] };
    });
}
