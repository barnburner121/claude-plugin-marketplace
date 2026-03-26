import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerJsonToTypesTools(server) {
    server.tool("jtt_from_json", "Generate TypeScript types from JSON examples", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "jtt_from_json", directory, instructions: "Generate TypeScript types from JSON examples in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("jtt_from_api", "Generate types from API response samples", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "jtt_from_api", directory, instructions: "Generate types from API response samples in the specified directory." }, null, 2) }],
        };
    });
    server.tool("jtt_generate_validators", "Generate runtime validators from types (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "jtt_generate_validators", directory, instructions: "Generate runtime validators from types in the specified directory." }, null, 2) }],
        };
    });
}
