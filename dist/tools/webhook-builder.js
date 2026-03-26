import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWebhookBuilderTools(server) {
    server.tool("webhook_generate_sender", "Generate webhook sender with payload construction, retry logic, and delivery tracking", {
        events: z.array(z.string()).describe("Event types that trigger webhooks (e.g. 'order.created', 'payment.completed')"),
        format: z.enum(["json", "cloudevents"]).default("json").describe("Payload format standard"),
        include_queue: z.boolean().default(true).describe("Whether to queue webhook deliveries for reliability"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_webhook_sender",
                        instructions: `Generate a webhook sender system for events: ${params.events.join(", ")}. Use ${params.format} payload format with event type, timestamp, and idempotency key. ${params.include_queue ? "Queue deliveries through BullMQ for reliability with retry on failure." : ""} Implement exponential backoff retries, delivery status tracking, timeout handling, and subscriber management with endpoint registration.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("webhook_generate_receiver", "Generate webhook receiver endpoints with validation, idempotency, and processing", {
        providers: z.array(z.string()).describe("Webhook providers to receive from (e.g. 'stripe', 'github', 'custom')"),
        processing: z.enum(["sync", "async"]).default("async").describe("Whether to process webhooks synchronously or asynchronously"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_webhook_receiver",
                        instructions: `Generate webhook receiver endpoints for providers: ${params.providers.join(", ")}. Implement signature verification per provider, idempotency checking to prevent duplicate processing, and ${params.processing} event processing. Add raw body parsing for signature validation, event type routing, error handling with appropriate HTTP responses (200 for accepted, 4xx for invalid), and event logging.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("webhook_add_signatures", "Pro: Add HMAC signature generation and verification for webhook security", {
        algorithm: z.enum(["sha256", "sha512", "sha1"]).default("sha256").describe("HMAC algorithm to use"),
        header_name: z.string().default("x-webhook-signature").describe("HTTP header name for the signature"),
        include_timestamp: z.boolean().default(true).describe("Whether to include timestamp to prevent replay attacks"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier !== "pro") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The webhook_add_signatures tool requires a Pro subscription. Please upgrade to access webhook signature security." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_webhook_signatures",
                        instructions: `Add HMAC-${params.algorithm} signature generation and verification. Place signatures in the '${params.header_name}' header. ${params.include_timestamp ? "Include timestamp in the signed payload to prevent replay attacks with a 5-minute tolerance window." : ""} Implement secret key rotation support, constant-time signature comparison to prevent timing attacks, and signature debugging utilities for integration testing.`,
                    }, null, 2),
                },
            ],
        };
    });
}
