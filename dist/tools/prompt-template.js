import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPromptTemplateTools(server) {
    server.tool("prompt_create_templates", "Generate prompt template management", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "prompt_create_templates", directory, instructions: "Generate prompt template management in the specified directory." }, null, 2) }] };
    });
    server.tool("prompt_add_variables", "Add template variable system", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "prompt_add_variables", directory, instructions: "Add template variable system in the specified directory." }, null, 2) }] };
    });
    server.tool("prompt_add_versioning", "Generate prompt versioning and A/B testing (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "prompt_add_versioning", directory, instructions: "Generate prompt versioning and A/B testing in the specified directory." }, null, 2) }] };
    });
}
