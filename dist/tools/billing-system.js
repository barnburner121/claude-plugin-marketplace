import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerBillingSystemTools(server) {
    server.tool("subscription_billing_setup", "Set up a complete subscription billing system with plan management, invoicing, and payment methods", {
        provider: z.enum(["stripe", "paddle", "lemon_squeezy"]).default("stripe"),
        plans: z.array(z.object({ name: z.string(), interval: z.enum(["month", "year"]), price_cents: z.number() })),
        tax_handling: z.enum(["inclusive", "exclusive", "none"]).default("none"),
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
                        action: "setup_subscription_billing",
                        instructions: `Set up subscription billing using ${params.provider} with ${params.plans.length} plans. Configure tax handling as "${params.tax_handling}". Create database models for subscriptions, invoices, and payment methods. Implement billing cycle management, grace periods for failed payments, and automated dunning emails. Add a customer billing portal endpoint.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("metered_billing", "Configure metered/usage-based billing with real-time usage tracking and threshold alerts", {
        meter_name: z.string().describe("Name of the usage meter"),
        unit: z.string().describe("Unit of measurement (e.g., api_calls, gb_stored)"),
        tiers: z.array(z.object({ up_to: z.number(), unit_price_cents: z.number() })).describe("Pricing tiers"),
        reset_period: z.enum(["monthly", "daily"]).default("monthly"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            action: "upgrade_required",
                            instructions: "Metered billing configuration is a Pro feature. Upgrade to access usage-based billing with tiered pricing, real-time tracking, and threshold alerts.",
                        }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "configure_metered_billing",
                        instructions: `Create metered billing for "${params.meter_name}" measured in ${params.unit}. Set up ${params.tiers.length} pricing tiers with graduated pricing. Reset usage ${params.reset_period}. Implement real-time usage recording via an ingest endpoint, aggregate usage for billing periods, and report to the payment provider. Add threshold alerts at 50%, 80%, and 100% of tier limits.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("invoice_generator", "Generate PDF invoices with line items, tax calculations, and branding", {
        company_name: z.string().describe("Company name for the invoice"),
        include_tax: z.boolean().default(true),
        template: z.enum(["minimal", "professional", "detailed"]).default("professional"),
        output_format: z.enum(["pdf", "html"]).default("pdf"),
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
                        action: "create_invoice_generator",
                        instructions: `Build an invoice generator for "${params.company_name}" using the "${params.template}" template. Output as ${params.output_format}. ${params.include_tax ? "Include tax calculation with configurable rates per jurisdiction." : "Exclude tax calculations."} Generate sequential invoice numbers, support line items with quantities and unit prices, calculate subtotals and totals, and store invoice records in the database. Use puppeteer or @react-pdf/renderer for PDF generation.`,
                    }, null, 2),
                },
            ],
        };
    });
}
