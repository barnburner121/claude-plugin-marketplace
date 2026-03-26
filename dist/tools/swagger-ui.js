import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSwaggerUiTools(server) {
    server.tool("swagger_setup", "Generate Swagger UI setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "swagger_setup", directory, instructions: "Generate Swagger UI setup in the specified directory." }, null, 2) }] };
    });
    server.tool("swagger_customize", "Customize Swagger UI theme", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "swagger_customize", directory, instructions: "Customize Swagger UI theme in the specified directory." }, null, 2) }] };
    });
    server.tool("swagger_add_auth", "Add authentication to Swagger UI (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "swagger_add_auth", directory, instructions: "Add authentication to Swagger UI in the specified directory." }, null, 2) }] };
    });
}
