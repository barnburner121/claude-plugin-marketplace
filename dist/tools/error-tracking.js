import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerErrorTrackingTools(server) {
    server.tool("errtrack_setup_sentry", "Generate Sentry error tracking integration", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "errtrack_setup_sentry", directory, instructions: "Generate Sentry error tracking integration in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("errtrack_setup_sourcemaps", "Set up source map uploading for error tracking", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "errtrack_setup_sourcemaps", directory, instructions: "Set up source map uploading for error tracking in the specified directory." }, null, 2) }],
        };
    });
    server.tool("errtrack_custom_context", "Generate custom error context and breadcrumbs (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "errtrack_custom_context", directory, instructions: "Generate custom error context and breadcrumbs in the specified directory." }, null, 2) }],
        };
    });
}
