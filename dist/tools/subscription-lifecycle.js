import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSubscriptionLifecycleTools(server) {
    server.tool("sub_generate_system", "Generate subscription lifecycle management", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "sub_generate_system", directory, instructions: "Generate subscription lifecycle management in the specified directory." }, null, 2) }] };
    });
    server.tool("sub_add_billing", "Add billing cycle management", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "sub_add_billing", directory, instructions: "Add billing cycle management in the specified directory." }, null, 2) }] };
    });
    server.tool("sub_add_dunning", "Generate dunning and recovery (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "sub_add_dunning", directory, instructions: "Generate dunning and recovery in the specified directory." }, null, 2) }] };
    });
}
