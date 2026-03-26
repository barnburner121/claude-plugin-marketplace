import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCodeSplittingTools(server) {
    server.tool("split_analyze_chunks", "Analyze code splitting opportunities", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "split_analyze_chunks", directory, instructions: "Analyze code splitting opportunities in the specified directory." }, null, 2) }] };
    });
    server.tool("split_generate_config", "Generate code splitting configuration", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "split_generate_config", directory, instructions: "Generate code splitting configuration in the specified directory." }, null, 2) }] };
    });
    server.tool("split_add_prefetch", "Generate prefetch strategies (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "split_add_prefetch", directory, instructions: "Generate prefetch strategies in the specified directory." }, null, 2) }] };
    });
}
