import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPinoSetupTools(server: McpServer) {
  server.tool(
    "pino_logger_config",
    "Generate a Pino logger configuration with serializers, redaction, and transport targets",
    {
      targets: z.array(z.enum(["stdout", "file", "datadog", "loki"])).default(["stdout"]),
      level: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
      redact_paths: z.array(z.string()).default(["password", "token", "authorization"]),
      pretty_print_dev: z.boolean().default(true),
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
                action: "create_pino_config",
                instructions: `Create a Pino logger with transport targets: ${params.targets.join(", ")}. Set level to "${params.level}". Redact fields: ${params.redact_paths.join(", ")}. ${params.pretty_print_dev ? "Use pino-pretty in development." : ""} Configure custom serializers for req/res/err. Use pino.transport() with worker threads for async logging. Add base fields: service name, version, environment. Export a factory function that creates child loggers with bound context.`,
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
    "pino_http_middleware",
    "Create pino-http middleware with request context propagation and custom serializers",
    {
      framework: z.enum(["express", "fastify", "hapi"]).default("fastify"),
      auto_logging: z.boolean().default(true),
      custom_props: z.array(z.string()).default(["userId", "tenantId"]),
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
                  instructions: "Pino HTTP middleware configuration is a Pro feature. Upgrade to access custom request context propagation, serializers, and framework-specific integrations.",
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
                action: "create_pino_http",
                instructions: `Set up pino-http middleware for ${params.framework}. ${params.auto_logging ? "Enable automatic request/response logging." : "Disable auto-logging, log manually."} Extract custom properties from request: ${params.custom_props.join(", ")}. Use genReqId to generate unique request IDs. Add custom serializers that exclude sensitive headers. Configure customLogLevel to use 'warn' for 4xx and 'error' for 5xx. Use AsyncLocalStorage for context propagation across async operations.`,
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
    "pino_transport_pipeline",
    "Build a Pino transport pipeline with filtering, transformation, and multiple destinations",
    {
      destinations: z.array(z.object({ target: z.string(), level: z.string() })),
      transform: z.boolean().default(false).describe("Add custom transform stream"),
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
                action: "create_pino_pipeline",
                instructions: `Create a Pino transport pipeline with ${params.destinations.length} destinations. Configure pino.transport({ targets: [...] }) with per-destination level filtering. ${params.transform ? "Add a custom transform stream using pino-abstract-transport for enriching log entries with hostname, pid, and custom metadata before routing." : ""} Use worker threads for non-blocking I/O. Handle backpressure and implement graceful shutdown with pino.final(). Add health checks for each transport destination.`,
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
