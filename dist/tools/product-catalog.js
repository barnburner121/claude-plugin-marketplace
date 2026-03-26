import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerProductCatalogTools(server) {
    server.tool("catalog_generate_schema", "Generate product catalog data model", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "catalog_generate_schema", directory, instructions: "Generate product catalog data model in the specified directory." }, null, 2) }] };
    });
    server.tool("catalog_add_categories", "Add category and taxonomy system", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "catalog_add_categories", directory, instructions: "Add category and taxonomy system in the specified directory." }, null, 2) }] };
    });
    server.tool("catalog_add_search", "Generate product search and filtering (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "catalog_add_search", directory, instructions: "Generate product search and filtering in the specified directory." }, null, 2) }] };
    });
}
