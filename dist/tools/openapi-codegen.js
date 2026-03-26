import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerOpenapiCodegenTools(server) {
    server.tool("openapi_generate_client", "Generate API client SDK from OpenAPI spec", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "openapi_generate_client", directory, instructions: "Generate API client SDK from OpenAPI spec in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("openapi_generate_types", "Generate TypeScript types from OpenAPI", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "openapi_generate_types", directory, instructions: "Generate TypeScript types from OpenAPI in the specified directory." }, null, 2) }],
        };
    });
    server.tool("openapi_generate_server", "Generate server stubs from OpenAPI spec (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "openapi_generate_server", directory, instructions: "Generate server stubs from OpenAPI spec in the specified directory." }, null, 2) }],
        };
    });
}
