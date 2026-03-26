import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerBatchJobTools(server) {
    server.tool("batch_generate_processor", "Generate batch job processor", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "batch_generate_processor", directory, instructions: "Generate batch job processor in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("batch_add_progress", "Add progress tracking and reporting", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "batch_add_progress", directory, instructions: "Add progress tracking and reporting in the specified directory." }, null, 2) }],
        };
    });
    server.tool("batch_add_checkpoints", "Generate checkpoint and resume logic (Pro feature)", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }],
            };
        }
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "batch_add_checkpoints", directory, instructions: "Generate checkpoint and resume logic in the specified directory." }, null, 2) }],
        };
    });
}
