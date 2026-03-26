import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCacheArchitectTools(server: McpServer) {
  server.tool(
    "cache_design_strategy",
    "Design a caching strategy with TTL policies, cache layers, and eviction rules",
    {
      resources: z.array(z.string()).describe("Resources/entities to cache (e.g. 'user-profiles', 'product-catalog')"),
      read_write_ratio: z.enum(["read-heavy", "balanced", "write-heavy"]).default("read-heavy").describe("Expected read/write ratio"),
      consistency: z.enum(["eventual", "strong"]).default("eventual").describe("Consistency requirement"),
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
                action: "design_cache_strategy",
                instructions: `Design a caching strategy for resources: ${params.resources.join(", ")}. The workload is ${params.read_write_ratio} with ${params.consistency} consistency requirements. Recommend cache layers (L1 in-memory, L2 Redis), TTL policies per resource, eviction strategies (LRU/LFU), cache-aside vs write-through patterns, and cache key naming conventions. Include cache warming strategies and size estimations.`,
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
    "cache_generate_redis",
    "Generate Redis caching implementation with connection pooling and serialization",
    {
      client: z.enum(["ioredis", "redis", "node-redis"]).default("ioredis").describe("Redis client library"),
      patterns: z.array(z.enum(["cache-aside", "write-through", "write-behind", "read-through"])).describe("Caching patterns to implement"),
      include_cluster: z.boolean().default(false).describe("Whether to include Redis Cluster support"),
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
                action: "generate_redis_cache",
                instructions: `Generate a Redis caching layer using ${params.client}. Implement patterns: ${params.patterns.join(", ")}. Include connection pooling, JSON serialization/deserialization, TTL management, key prefixing, and error fallback to database. ${params.include_cluster ? "Add Redis Cluster support with hash slot awareness." : ""} Add health checks, metrics collection, and graceful degradation when Redis is unavailable.`,
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
    "cache_invalidation_setup",
    "Pro: Set up cache invalidation with event-driven purging and tag-based invalidation",
    {
      strategy: z.enum(["event-driven", "ttl-based", "tag-based", "hybrid"]).default("hybrid").describe("Invalidation strategy"),
      event_source: z.enum(["database-triggers", "application-events", "cdc", "webhooks"]).default("application-events").describe("Source of invalidation events"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier !== "pro") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { action: "upgrade_required", instructions: "The cache_invalidation_setup tool requires a Pro subscription. Please upgrade to access cache invalidation setup." },
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
                action: "setup_cache_invalidation",
                instructions: `Set up ${params.strategy} cache invalidation using ${params.event_source} as the event source. Implement tag-based grouping for bulk invalidation, cascade invalidation for related entities, stampede protection with locking, and invalidation logging for debugging. Add retry logic for failed invalidations and eventual consistency guarantees.`,
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
