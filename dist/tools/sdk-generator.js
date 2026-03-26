import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSdkGeneratorTools(server) {
    server.tool("sdk_from_openapi", "Generate SDK from OpenAPI specification", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "sdk_from_openapi", directory, instructions: "Generate SDK from OpenAPI specification in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("sdk_generate_typescript", "Generate TypeScript SDK with types", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "sdk_generate_typescript", directory, instructions: "Generate TypeScript SDK with types in the specified directory." }, null, 2) }],
        };
    });
    server.tool("sdk_generate_python", "Generate Python SDK with type hints (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "sdk_generate_python", directory, instructions: "Generate Python SDK with type hints in the specified directory." }, null, 2) }],
        };
    });
}
