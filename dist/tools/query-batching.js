import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerQueryBatchingTools(server) {
    server.tool("qbatch_setup_dataloader", "Set up DataLoader pattern", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "qbatch_setup_dataloader", directory, instructions: "Set up DataLoader pattern in the specified directory." }, null, 2) }] };
    });
    server.tool("qbatch_add_caching", "Add batch result caching", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "qbatch_add_caching", directory, instructions: "Add batch result caching in the specified directory." }, null, 2) }] };
    });
    server.tool("qbatch_optimize", "Optimize batch sizes and timing (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "qbatch_optimize", directory, instructions: "Optimize batch sizes and timing in the specified directory." }, null, 2) }] };
    });
}
