import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerRetryPolicyTools(server: McpServer) {
  server.tool(
    "retry_generate_middleware",
    "Generate retry middleware with configurable policies for HTTP clients",
    {
      service_name: z.string().describe("Name of the service"),
      language: z.string().describe("Programming language (e.g. typescript, go, python, java)"),
      max_retries: z.number().optional().describe("Maximum retry attempts (default 3)"),
      retryable_status_codes: z.array(z.number()).optional().describe("HTTP status codes to retry on"),
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
                action: "generate_middleware",
                instructions: `Generate retry middleware for service '${params.service_name}' in '${params.language}' with max ${params.max_retries ?? 3} retries. ${params.retryable_status_codes ? `Retry on status codes: ${params.retryable_status_codes.join(", ")}.` : "Retry on 429, 502, 503, 504 status codes."} Include idempotency detection, request cloning, retry budget tracking, and per-request retry context logging.`,
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
    "retry_configure_backoff",
    "Configure backoff strategies for retry policies",
    {
      strategy: z.enum(["fixed", "exponential", "decorrelated_jitter", "equal_jitter", "full_jitter"]).describe("Backoff strategy"),
      base_delay_ms: z.number().optional().describe("Base delay in milliseconds (default 100)"),
      max_delay_ms: z.number().optional().describe("Maximum delay in milliseconds (default 30000)"),
      language: z.string().describe("Programming language"),
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
                action: "configure_backoff",
                instructions: `Configure '${params.strategy}' backoff strategy in '${params.language}' with base delay ${params.base_delay_ms ?? 100}ms and max delay ${params.max_delay_ms ?? 30000}ms. ${params.strategy === "exponential" ? "Use exponential increase with multiplier." : params.strategy === "decorrelated_jitter" ? "Apply decorrelated jitter for distributed systems." : params.strategy === "equal_jitter" ? "Split delay into fixed and random equal halves." : params.strategy === "full_jitter" ? "Randomize between 0 and exponential cap." : "Use constant delay between retries."} Include delay calculation function and unit tests.`,
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
    "retry_add_circuit_breaker",
    "Combine retry policies with circuit breaker for resilient communication (Pro)",
    {
      service_name: z.string().describe("Name of the service"),
      language: z.string().describe("Programming language"),
      failure_threshold: z.number().optional().describe("Circuit breaker failure threshold (default 5)"),
      reset_timeout_ms: z.number().optional().describe("Circuit breaker reset timeout in ms (default 30000)"),
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
                { action: "upgrade_required", instructions: "The retry_add_circuit_breaker tool requires a Pro subscription. Please upgrade to access combined retry and circuit breaker features." },
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
                action: "add_circuit_breaker",
                instructions: `Combine retry policy with circuit breaker for service '${params.service_name}' in '${params.language}'. Set failure threshold to ${params.failure_threshold ?? 5} and reset timeout to ${params.reset_timeout_ms ?? 30000}ms. Retries operate within the circuit breaker -- when open, skip retries and fail fast. Include bulkhead isolation, timeout policies, and a resilience pipeline that composes retry, circuit breaker, and timeout in the correct order.`,
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
