import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCliDocsTools(server) {
    server.tool("clidocs_generate_help", "Generate CLI help documentation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "clidocs_generate_help", directory, instructions: "Generate CLI help documentation in the specified directory." }, null, 2) }] };
    });
    server.tool("clidocs_generate_manpage", "Generate man page documentation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "clidocs_generate_manpage", directory, instructions: "Generate man page documentation in the specified directory." }, null, 2) }] };
    });
    server.tool("clidocs_generate_markdown", "Generate Markdown CLI docs (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "clidocs_generate_markdown", directory, instructions: "Generate Markdown CLI docs in the specified directory." }, null, 2) }] };
    });
}
