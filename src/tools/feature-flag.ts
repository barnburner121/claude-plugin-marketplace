import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerFeatureFlagTools(server: McpServer) {
  server.tool(
    "flag_setup_system",
    "Set up a feature flag system with storage, evaluation engine, and admin API",
    {
      storage: z.enum(["redis", "database", "config-file", "launchdarkly"]).default("redis").describe("Feature flag storage backend"),
      framework: z.enum(["express", "fastify", "nestjs"]).default("express").describe("Server framework for admin API"),
      include_sdk: z.boolean().default(true).describe("Whether to generate a client SDK for flag evaluation"),
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
                action: "setup_feature_flag_system",
                instructions: `Set up a feature flag system using ${params.storage} for storage with a ${params.framework} admin API. Implement flag CRUD operations, boolean and multivariate flag types, user/segment targeting rules, percentage rollouts, and environment separation (dev/staging/prod). ${params.include_sdk ? "Generate a lightweight client SDK with local caching and polling for flag updates." : ""} Add flag change audit logging.`,
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
    "flag_generate_checks",
    "Generate feature flag check utilities and middleware for gating features",
    {
      flag_names: z.array(z.string()).describe("Feature flag names to generate checks for (e.g. 'new-checkout', 'dark-mode')"),
      check_type: z.enum(["middleware", "decorator", "helper", "react-hook"]).default("middleware").describe("Type of flag check to generate"),
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
                action: "generate_flag_checks",
                instructions: `Generate ${params.check_type} feature flag checks for flags: ${params.flag_names.join(", ")}. Include typed flag evaluation with fallback defaults, user context passing for targeted rollouts, flag evaluation logging for analytics, and graceful handling when the flag service is unavailable. Add TypeScript type safety for flag names and value types.`,
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
    "flag_ab_test_setup",
    "Pro: Set up A/B testing with variant assignment, metrics tracking, and statistical analysis",
    {
      experiment_name: z.string().describe("Name of the A/B test experiment"),
      variants: z.array(z.string()).describe("Variant names (e.g. 'control', 'variant-a', 'variant-b')"),
      metrics: z.array(z.string()).describe("Metrics to track (e.g. 'conversion-rate', 'click-through', 'revenue')"),
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
                { action: "upgrade_required", instructions: "The flag_ab_test_setup tool requires a Pro subscription. Please upgrade to access A/B testing setup." },
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
                action: "setup_ab_test",
                instructions: `Set up A/B test '${params.experiment_name}' with variants: ${params.variants.join(", ")}. Track metrics: ${params.metrics.join(", ")}. Implement deterministic variant assignment using user ID hashing, mutual exclusion with other experiments, metric event collection, and statistical significance calculation. Add experiment lifecycle management (draft, running, concluded) and winner declaration.`,
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
