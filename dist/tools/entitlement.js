import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerEntitlementTools(server) {
    server.tool("feature_flag_system", "Set up a feature flag system for gating features by plan, user, or percentage rollout", {
        features: z.array(z.object({ name: z.string(), plans: z.array(z.string()) })).describe("Features and their allowed plans"),
        storage: z.enum(["database", "config", "launchdarkly"]).default("database"),
        cache_ttl_seconds: z.number().default(300),
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
                        action: "setup_feature_flags",
                        instructions: `Create a feature flag system using ${params.storage} with ${params.features.length} features. Each feature is gated by plan level. Cache entitlements for ${params.cache_ttl_seconds} seconds. Implement a hasFeature(userId, featureName) function and an Express/Next.js middleware. Support boolean flags, percentage rollouts, and user targeting. Add an admin API for toggling features. Emit events on flag checks for analytics.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("entitlement_middleware", "Create middleware that enforces feature entitlements based on the user's subscription plan", {
        framework: z.enum(["express", "nextjs", "fastify"]).default("nextjs"),
        plans: z.array(z.object({ name: z.string(), features: z.array(z.string()) })),
        deny_action: z.enum(["403", "redirect", "upgrade_prompt"]).default("403"),
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
                            instructions: "Entitlement middleware generation is a Pro feature. Upgrade to access plan-based feature gating with customizable deny actions and framework-specific middleware.",
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
                        action: "create_entitlement_middleware",
                        instructions: `Create ${params.framework} middleware for entitlement checks across ${params.plans.length} plans. On unauthorized access: ${params.deny_action}. Middleware signature: requireFeature("feature_name"). Look up the user's plan from the session/JWT, check the feature matrix, and allow or deny. Cache the plan-feature mapping in memory. Log denied access attempts for analytics. Support route-level and component-level checks.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("plan_limits_config", "Generate a plan limits configuration with rate limits, storage quotas, and feature caps", {
        plans: z.array(z.object({
            name: z.string(),
            rate_limit_rpm: z.number(),
            storage_mb: z.number(),
            seats: z.number(),
        })),
        enforcement: z.enum(["strict", "soft", "notify_only"]).default("strict"),
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
                        action: "create_plan_limits_config",
                        instructions: `Generate a plan limits configuration for ${params.plans.length} plans with rate limits, storage quotas, and seat limits. Enforcement mode: "${params.enforcement}". Create a typed config object with all limits per plan. Implement checkLimit(userId, limitType) that returns { allowed, current, limit, remaining }. Add a LimitsProvider React context for client-side limit awareness. Create database migrations for tracking current usage against limits.`,
                    }, null, 2),
                },
            ],
        };
    });
}
