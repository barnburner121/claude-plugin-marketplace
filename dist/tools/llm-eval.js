import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerLlmEvalTools(server) {
    server.tool("llmeval_setup_framework", "Set up LLM evaluation framework", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "llmeval_setup_framework", directory, instructions: "Set up LLM evaluation framework in the specified directory." }, null, 2) }] };
    });
    server.tool("llmeval_add_benchmarks", "Add evaluation benchmarks", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "llmeval_add_benchmarks", directory, instructions: "Add evaluation benchmarks in the specified directory." }, null, 2) }] };
    });
    server.tool("llmeval_generate_reports", "Generate evaluation reports (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "llmeval_generate_reports", directory, instructions: "Generate evaluation reports in the specified directory." }, null, 2) }] };
    });
}
