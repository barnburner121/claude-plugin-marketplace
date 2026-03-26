import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRedisPatternsTools(server) {
    server.tool("redis_setup_caching", "Set up Redis caching patterns with key design, TTL management, and serialization", {
        resources: z.array(z.string()).describe("Resources to cache (e.g. 'user-sessions', 'product-details')"),
        client: z.enum(["ioredis", "redis", "node-redis"]).default("ioredis").describe("Redis client library"),
        serialization: z.enum(["json", "msgpack", "protobuf"]).default("json").describe("Serialization format"),
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
                        action: "setup_redis_caching",
                        instructions: `Set up Redis caching for resources: ${params.resources.join(", ")} using ${params.client} with ${params.serialization} serialization. Design key naming conventions with prefixes and namespaces, implement TTL policies per resource type, add cache stampede protection with locking, and create typed cache wrapper functions. Include cache hit/miss metrics, memory usage monitoring, and graceful fallback when Redis is unavailable.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("redis_setup_sessions", "Set up Redis-backed session management with secure storage and expiration", {
        framework: z.enum(["express", "fastify", "koa", "nestjs"]).default("express").describe("Server framework"),
        session_ttl: z.number().default(86400).describe("Session TTL in seconds (default 24 hours)"),
        include_refresh: z.boolean().default(true).describe("Whether to include sliding window refresh"),
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
                        action: "setup_redis_sessions",
                        instructions: `Set up Redis-backed session management for ${params.framework} with ${params.session_ttl}s TTL. Configure secure session cookies (httpOnly, secure, sameSite), session data serialization, and Redis connection with reconnect logic. ${params.include_refresh ? "Implement sliding window session refresh on activity." : ""} Add session invalidation endpoints, concurrent session limits per user, and session listing for admin.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("redis_setup_pubsub", "Pro: Set up Redis Pub/Sub for real-time event broadcasting and microservice communication", {
        channels: z.array(z.string()).describe("Pub/Sub channel names (e.g. 'notifications', 'order-updates')"),
        pattern_subscribe: z.boolean().default(false).describe("Whether to use pattern-based subscriptions"),
        include_streams: z.boolean().default(false).describe("Whether to also set up Redis Streams for durable messaging"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The redis_setup_pubsub tool requires a Pro subscription. Please upgrade to access Redis Pub/Sub setup." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "setup_redis_pubsub",
                        instructions: `Set up Redis Pub/Sub for channels: ${params.channels.join(", ")}. ${params.pattern_subscribe ? "Use pattern-based subscriptions for flexible channel matching." : ""} Implement typed message publishers and subscribers, message serialization, error handling for subscriber failures, and connection management with dedicated subscriber connections. ${params.include_streams ? "Also set up Redis Streams with consumer groups for durable, at-least-once message delivery." : ""} Add health monitoring and message throughput tracking.`,
                    }, null, 2),
                },
            ],
        };
    });
}
