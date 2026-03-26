import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerGraphqlFederationTools(server) {
    server.tool("gqlfed_setup", "Generate Apollo Federation setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "gqlfed_setup", directory, instructions: "Generate Apollo Federation setup in the specified directory." }, null, 2) }] };
    });
    server.tool("gqlfed_add_subgraph", "Add federated subgraph", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "gqlfed_add_subgraph", directory, instructions: "Add federated subgraph in the specified directory." }, null, 2) }] };
    });
    server.tool("gqlfed_optimize", "Optimize federation query planning (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "gqlfed_optimize", directory, instructions: "Optimize federation query planning in the specified directory." }, null, 2) }] };
    });
}
