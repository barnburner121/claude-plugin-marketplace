import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPandasPipelineTools(server) {
    server.tool("pandas_generate_pipeline", "Generate pandas data processing pipeline", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "pandas_generate_pipeline", directory, instructions: "Generate pandas data processing pipeline in the specified directory." }, null, 2) }] };
    });
    server.tool("pandas_optimize_memory", "Optimize pandas memory usage", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "pandas_optimize_memory", directory, instructions: "Optimize pandas memory usage in the specified directory." }, null, 2) }] };
    });
    server.tool("pandas_generate_tests", "Generate data pipeline tests (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "pandas_generate_tests", directory, instructions: "Generate data pipeline tests in the specified directory." }, null, 2) }] };
    });
}
