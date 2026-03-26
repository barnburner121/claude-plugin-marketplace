import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerStructuredLogTools(server) {
    server.tool("slog_setup_format", "Generate structured logging format setup", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "slog_setup_format", directory, instructions: "Generate structured logging format setup in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("slog_add_context", "Add contextual logging with correlation IDs", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "slog_add_context", directory, instructions: "Add contextual logging with correlation IDs in the specified directory." }, null, 2) }],
        };
    });
    server.tool("slog_configure_transport", "Configure log transports and destinations (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "slog_configure_transport", directory, instructions: "Configure log transports and destinations in the specified directory." }, null, 2) }],
        };
    });
}
