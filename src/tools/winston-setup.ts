import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerWinstonSetupTools(server: McpServer) {
  server.tool(
    "winston_logger_config",
    "Generate a Winston logger configuration with transports, formats, and log levels",
    {
      transports: z.array(z.enum(["console", "file", "http", "datadog", "cloudwatch"])).default(["console", "file"]),
      log_level: z.enum(["error", "warn", "info", "debug", "verbose"]).default("info"),
      format: z.enum(["json", "simple", "colorized"]).default("json"),
      log_directory: z.string().default("./logs"),
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
                action: "create_winston_config",
                instructions: `Create a Winston logger configuration with transports: ${params.transports.join(", ")}. Set default level to "${params.log_level}" with "${params.format}" format. Log files go to "${params.log_directory}". Configure daily rotation with 14-day retention using winston-daily-rotate-file. Add error-specific transport for error.log. Include timestamp, label, and stack trace formatting. Export a createLogger factory function with child logger support for adding request context.`,
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
    "winston_request_logger",
    "Create Express/Fastify request logging middleware using Winston with correlation IDs",
    {
      framework: z.enum(["express", "fastify", "koa"]).default("express"),
      include_body: z.boolean().default(false),
      correlation_header: z.string().default("x-request-id"),
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
                  instructions: "Winston request logging middleware is a Pro feature. Upgrade to access correlation ID tracking, request/response body logging, and framework-specific middleware generation.",
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
                action: "create_request_logger",
                instructions: `Create ${params.framework} request logging middleware using Winston. Extract or generate correlation ID from "${params.correlation_header}" header. Log request method, URL, status code, response time, and user agent. ${params.include_body ? "Include sanitized request/response bodies (redact sensitive fields like password, token, ssn)." : "Exclude request/response bodies for performance."} Use AsyncLocalStorage to propagate the correlation ID to all downstream log calls. Add the correlation ID to response headers.`,
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
    "winston_error_transport",
    "Set up a Winston transport for error alerting via email, Slack, or PagerDuty",
    {
      alert_channel: z.enum(["email", "slack", "pagerduty"]).default("slack"),
      min_level: z.enum(["error", "warn"]).default("error"),
      throttle_minutes: z.number().default(5),
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
                action: "create_error_transport",
                instructions: `Create a custom Winston transport that sends ${params.min_level}-level and above logs to ${params.alert_channel}. Throttle duplicate alerts to once per ${params.throttle_minutes} minutes using a hash of the error message. Include stack trace, request context, and environment info in alerts. Implement a custom Transport class extending winston-transport. Buffer alerts and batch-send to reduce noise. Add a deduplication window to prevent alert storms.`,
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
