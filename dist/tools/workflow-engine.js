import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWorkflowEngineTools(server) {
    server.tool("workflow_generate_engine", "Generate workflow execution engine", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "workflow_generate_engine", directory, instructions: "Generate workflow execution engine in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("workflow_add_steps", "Generate workflow step definitions", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "workflow_add_steps", directory, instructions: "Generate workflow step definitions in the specified directory." }, null, 2) }],
        };
    });
    server.tool("workflow_add_conditions", "Generate conditional branching logic (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "workflow_add_conditions", directory, instructions: "Generate conditional branching logic in the specified directory." }, null, 2) }],
        };
    });
}
