import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerStripeSetupTools(server: McpServer) {
  server.tool(
    "stripe_checkout_session",
    "Generate a Stripe Checkout session with line items, success/cancel URLs, and optional trial periods",
    {
      product_name: z.string().describe("Name of the product"),
      price_cents: z.number().describe("Price in cents"),
      currency: z.string().default("usd").describe("Currency code"),
      success_url: z.string().describe("URL to redirect on success"),
      cancel_url: z.string().describe("URL to redirect on cancel"),
      trial_days: z.number().optional().describe("Number of trial days"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_stripe_checkout",
                instructions: `Create a Stripe Checkout session for "${params.product_name}" at ${params.price_cents} ${params.currency}. Configure success URL to "${params.success_url}" and cancel URL to "${params.cancel_url}".${params.trial_days ? ` Include a ${params.trial_days}-day free trial.` : ""} Use stripe.checkout.sessions.create with mode 'subscription' or 'payment' based on context. Include metadata for tracking.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "stripe_subscription_manager",
    "Set up Stripe subscription lifecycle management with plan changes, cancellations, and proration",
    {
      plans: z.array(z.object({ name: z.string(), price_id: z.string() })).describe("Available subscription plans"),
      proration_behavior: z.enum(["create_prorations", "none", "always_invoice"]).default("create_prorations"),
      cancel_at_period_end: z.boolean().default(true),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  action: "upgrade_required",
                  instructions: "Stripe Subscription Manager is a Pro feature. Upgrade your plan to access subscription lifecycle management with proration, plan changes, and automated cancellation flows.",
                },
                null,
                2
              ),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "setup_subscription_manager",
                instructions: `Create a subscription management module supporting ${params.plans.length} plans. Handle upgrades/downgrades with proration behavior "${params.proration_behavior}". Set cancel_at_period_end to ${params.cancel_at_period_end}. Implement endpoints: POST /subscriptions (create), PATCH /subscriptions/:id (update plan), DELETE /subscriptions/:id (cancel). Use Stripe customer portal for self-service.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "stripe_webhook_handler",
    "Generate a Stripe webhook handler with signature verification and event routing",
    {
      events: z.array(z.string()).describe("Stripe event types to handle"),
      endpoint_path: z.string().default("/api/webhooks/stripe"),
      framework: z.enum(["express", "nextjs", "fastify"]).default("nextjs"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_webhook_handler",
                instructions: `Create a Stripe webhook handler at "${params.endpoint_path}" for ${params.framework}. Verify signatures using stripe.webhooks.constructEvent with STRIPE_WEBHOOK_SECRET. Route events: ${params.events.join(", ")}. Disable body parsing for raw body access. Return 200 immediately, process asynchronously. Add idempotency checks to prevent duplicate processing. Log all events for debugging.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
