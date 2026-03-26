import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSendgridSetupTools(server) {
    server.tool("sendgrid_generate_integration", "Generate SendGrid API integration", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "sendgrid_generate_integration", directory, instructions: "Generate SendGrid API integration in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
        };
    });
    server.tool("sendgrid_setup_templates", "Set up dynamic email templates", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{ type: "text", text: JSON.stringify({ action: "sendgrid_setup_templates", directory, instructions: "Set up dynamic email templates in the specified directory." }, null, 2) }],
        };
    });
    server.tool("sendgrid_setup_webhooks", "Generate SendGrid webhook event handling (Pro feature)", {
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
            content: [{ type: "text", text: JSON.stringify({ action: "sendgrid_setup_webhooks", directory, instructions: "Generate SendGrid webhook event handling in the specified directory." }, null, 2) }],
        };
    });
}
