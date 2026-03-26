import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerUsageMeteringTools(server: McpServer) {
  server.tool(
    "usage_tracker",
    "Set up a real-time usage tracking system with counters, gauges, and histograms",
    {
      metrics: z.array(z.object({ name: z.string(), type: z.enum(["counter", "gauge", "histogram"]) })),
      storage: z.enum(["redis", "postgres", "dynamodb"]).default("redis"),
      flush_interval_seconds: z.number().default(60),
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
                action: "setup_usage_tracker",
                instructions: `Create a usage tracking system with ${params.metrics.length} metrics stored in ${params.storage}. Buffer events in memory and flush every ${params.flush_interval_seconds} seconds. Implement increment/decrement for counters, set/get for gauges, and observe for histograms. Add a middleware that automatically tracks API request counts. Provide query endpoints for usage summaries by time range. Use atomic operations for concurrent safety.`,
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
    "usage_quota_enforcer",
    "Implement usage quota enforcement with soft and hard limits and overage handling",
    {
      resource: z.string().describe("Resource being metered"),
      soft_limit: z.number().describe("Soft limit threshold"),
      hard_limit: z.number().describe("Hard limit threshold"),
      overage_action: z.enum(["block", "throttle", "charge"]).default("block"),
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
                  instructions: "Usage quota enforcement is a Pro feature. Upgrade to access soft/hard limits, overage handling, and automated quota management for your resources.",
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
                action: "setup_quota_enforcer",
                instructions: `Create a quota enforcer for "${params.resource}" with soft limit at ${params.soft_limit} and hard limit at ${params.hard_limit}. On soft limit: send warning notification to the user. On hard limit: ${params.overage_action} the resource. Implement as middleware that checks usage before allowing requests. Cache current usage in Redis with TTL. Send webhook notifications at 50%, 80%, and 100% of quota. Provide an admin override mechanism.`,
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
    "usage_dashboard_data",
    "Generate usage analytics data endpoints with aggregation and time-series queries",
    {
      metrics: z.array(z.string()).describe("Metric names to aggregate"),
      granularity: z.enum(["hourly", "daily", "weekly", "monthly"]).default("daily"),
      retention_days: z.number().default(90),
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
                action: "create_usage_dashboard_data",
                instructions: `Create usage analytics endpoints for metrics: ${params.metrics.join(", ")}. Aggregate at ${params.granularity} granularity with ${params.retention_days}-day retention. Endpoints: GET /usage/summary (current period totals), GET /usage/timeseries (time-bucketed data), GET /usage/breakdown (per-resource breakdown). Use materialized views or pre-aggregation for performance. Support date range filtering and comparison with previous periods. Return data formatted for chart libraries.`,
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
