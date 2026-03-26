import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRateLimiterTools(server) {
    server.tool("rate_generate_middleware", "Generate rate limiting middleware for Express, Fastify, or Koa with configurable windows", {
        framework: z.enum(["express", "fastify", "koa", "hono", "nestjs"]).describe("Web framework"),
        window_ms: z.number().describe("Rate limit window in milliseconds"),
        max_requests: z.number().describe("Maximum requests per window"),
        key_by: z.enum(["ip", "user", "api-key", "custom"]).optional().describe("Rate limit key strategy"),
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
                        action: "generate_rate_limit_middleware",
                        instructions: `Generate rate limiting middleware for ${params.framework}. Window: ${params.window_ms}ms, max requests: ${params.max_requests}. Key by: ${params.key_by || "ip"}. Include middleware function, rate limit headers (X-RateLimit-*), 429 response handler, and skip/whitelist configuration.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("rate_configure_strategies", "Configure advanced rate limiting strategies like sliding window, token bucket, or leaky bucket", {
        algorithm: z.enum(["fixed-window", "sliding-window", "token-bucket", "leaky-bucket"]).describe("Rate limiting algorithm"),
        config: z.object({
            capacity: z.number().describe("Maximum capacity"),
            refill_rate: z.number().optional().describe("Token refill rate per second"),
        }).describe("Algorithm configuration"),
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
                        action: "configure_rate_limit_strategy",
                        instructions: `Implement a ${params.algorithm} rate limiting strategy with capacity ${params.config.capacity}${params.config.refill_rate ? ` and refill rate ${params.config.refill_rate}/s` : ""}. Include the algorithm implementation, in-memory store, distributed store interface, and burst handling.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("rate_add_redis", "Add Redis-backed distributed rate limiting with cluster support (Pro)", {
        redis_url: z.string().optional().describe("Redis connection URL"),
        cluster: z.boolean().optional().describe("Enable Redis cluster support"),
        fallback: z.enum(["allow", "deny", "in-memory"]).optional().describe("Fallback behavior when Redis is unavailable"),
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
                        text: JSON.stringify({ error: "This tool requires a Pro subscription." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_redis_rate_limiting",
                        instructions: `Add Redis-backed rate limiting. ${params.redis_url ? `Connect to: ${params.redis_url}.` : "Use default localhost connection."} ${params.cluster ? "Enable Redis cluster support with hash tags." : ""} Fallback: ${params.fallback || "in-memory"}. Include Lua scripts for atomic operations, connection pooling, health checks, and graceful degradation.`,
                    }, null, 2),
                },
            ],
        };
    });
}
