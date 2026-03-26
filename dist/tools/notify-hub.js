import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerNotifyHubTools(server) {
    // Tool 1: Generate notification service integration
    server.tool("notify_setup_service", "Generate notification service integration code for email, SMS, or push notifications", {
        provider: z
            .enum([
            "sendgrid",
            "ses",
            "mailgun",
            "twilio",
            "firebase-fcm",
            "onesignal",
            "resend",
            "postmark",
        ])
            .describe("Notification service provider"),
        channels: z
            .array(z.enum(["email", "sms", "push", "webhook"]))
            .describe("Notification channels to set up"),
        language: z
            .enum(["typescript", "python", "go"])
            .default("typescript"),
        api_key: z.string().optional(),
    }, async ({ provider, channels, language, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "setup_notification_service",
                        provider,
                        channels,
                        language,
                        instructions: `Generate a complete ${provider} integration in ${language} that includes: (1) A notification service class/module with methods for each channel: ${channels.join(", ")}, (2) Template system for notification content (HTML email templates, SMS templates), (3) Retry logic with exponential backoff, (4) Rate limiting to stay within provider limits, (5) Delivery status tracking, (6) Error handling with fallback providers, (7) Environment variable configuration for API keys, (8) Example usage code. Include the correct SDK package name for ${provider}.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: Create notification templates
    server.tool("notify_create_templates", "Generate notification templates for common transactional events", {
        events: z
            .array(z.enum([
            "welcome",
            "password-reset",
            "invoice",
            "order-confirmation",
            "shipping-update",
            "trial-expiring",
            "payment-failed",
            "account-locked",
            "team-invite",
            "weekly-digest",
        ]))
            .describe("Notification events to create templates for"),
        brand_name: z.string().describe("Your brand/product name"),
        channels: z
            .array(z.enum(["email", "sms", "push"]))
            .default(["email"]),
        api_key: z.string().optional(),
    }, async ({ events, brand_name, channels, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "create_templates",
                        events,
                        brand_name,
                        channels,
                        instructions: `Generate notification templates for ${brand_name} covering events: ${events.join(", ")}. For each event and channel (${channels.join(", ")}): (1) Email: responsive HTML template with dynamic variables ({{user_name}}, {{action_url}}, etc.), plain text fallback, subject line, (2) SMS: concise message under 160 chars with dynamic variables, (3) Push: title + body under 100 chars. Use professional, friendly tone. Include unsubscribe links for emails. All templates should be ready to use with template variable placeholders.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: Notification pipeline with preferences (Pro)
    server.tool("notify_build_pipeline", "Generate a full notification pipeline with user preferences, queuing, and delivery tracking (Pro feature)", {
        language: z.enum(["typescript", "python"]).default("typescript"),
        queue: z
            .enum(["bullmq", "sqs", "rabbitmq", "redis"])
            .default("bullmq")
            .describe("Message queue system"),
        database: z
            .enum(["postgres", "mongodb", "mysql"])
            .default("postgres")
            .describe("Database for preferences and logs"),
        api_key: z.string().optional(),
    }, async ({ language, queue, database, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: "Notification pipeline generation is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "build_notification_pipeline",
                        language,
                        queue,
                        database,
                        instructions: `Generate a complete notification pipeline in ${language}: (1) User preferences table/schema (channels per event type, quiet hours, timezone), (2) Notification dispatcher that checks preferences before sending, (3) ${queue} queue integration for async delivery, (4) Delivery log table tracking status (sent/delivered/failed/bounced), (5) Retry worker for failed deliveries, (6) Analytics queries (delivery rate, open rate, bounce rate), (7) REST API endpoints for managing preferences, (8) Webhook handler for delivery status callbacks from providers.`,
                    }, null, 2),
                },
            ],
        };
    });
}
