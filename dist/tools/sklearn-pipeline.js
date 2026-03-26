import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSklearnPipelineTools(server) {
    server.tool("sklearn_generate_pipeline", "Generate scikit-learn ML pipeline", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "sklearn_generate_pipeline", directory, instructions: "Generate scikit-learn ML pipeline in the specified directory." }, null, 2) }] };
    });
    server.tool("sklearn_add_preprocessing", "Add feature preprocessing steps", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "sklearn_add_preprocessing", directory, instructions: "Add feature preprocessing steps in the specified directory." }, null, 2) }] };
    });
    server.tool("sklearn_add_evaluation", "Generate model evaluation framework (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "sklearn_add_evaluation", directory, instructions: "Generate model evaluation framework in the specified directory." }, null, 2) }] };
    });
}
