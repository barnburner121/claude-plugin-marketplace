import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerModelRegistryTools(server) {
    server.tool("model_setup_registry", "Set up ML model registry", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "model_setup_registry", directory, instructions: "Set up ML model registry in the specified directory." }, null, 2) }] };
    });
    server.tool("model_add_versioning", "Add model versioning and lineage", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "model_add_versioning", directory, instructions: "Add model versioning and lineage in the specified directory." }, null, 2) }] };
    });
    server.tool("model_add_deployment", "Generate model deployment pipeline (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "model_add_deployment", directory, instructions: "Generate model deployment pipeline in the specified directory." }, null, 2) }] };
    });
}
