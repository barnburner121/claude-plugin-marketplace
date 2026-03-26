import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerOnboardingFlowTools(server) {
    server.tool("onboard_generate_flow", "Generate SaaS onboarding flow", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "onboard_generate_flow", directory, instructions: "Generate SaaS onboarding flow in the specified directory." }, null, 2) }] };
    });
    server.tool("onboard_add_steps", "Add onboarding step tracking", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "onboard_add_steps", directory, instructions: "Add onboarding step tracking in the specified directory." }, null, 2) }] };
    });
    server.tool("onboard_add_analytics", "Generate onboarding analytics (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "onboard_add_analytics", directory, instructions: "Generate onboarding analytics in the specified directory." }, null, 2) }] };
    });
}
