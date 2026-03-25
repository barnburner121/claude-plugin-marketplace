import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerLogSleuthTools(server: McpServer) {
  // Tool 1: Analyze log files for patterns and anomalies
  server.tool(
    "log_analyze",
    "Analyze log files for error patterns, anomalies, and trends",
    {
      log_path: z.string().describe("Path to log file or directory"),
      time_range: z
        .string()
        .optional()
        .describe("Time range to analyze (e.g., 'last 1h', 'last 24h')"),
      level: z
        .enum(["all", "error", "warn", "info", "debug"])
        .default("all"),
      api_key: z.string().optional(),
    },
    async ({ log_path, time_range, level, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "analyze_logs",
                log_path,
                time_range,
                level,
                instructions: `Read the log file(s) at ${log_path}. Analyze for: (1) Most frequent error messages (group similar errors), (2) Error rate trends over time, (3) Unusual patterns or spikes, (4) Stack traces and their root causes, (5) Slow operations (if timing data present). ${time_range ? `Focus on ${time_range}.` : ""} ${level !== "all" ? `Filter to ${level} level.` : ""} Output a structured analysis report.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 2: Search logs with structured queries
  server.tool(
    "log_search",
    "Search through log files with structured queries — filter by level, time, message pattern, and context",
    {
      log_path: z.string().describe("Path to log file or directory"),
      query: z.string().describe("Search pattern (regex supported)"),
      context_lines: z
        .number()
        .default(3)
        .describe("Lines of context around matches"),
      max_results: z.number().default(50),
      api_key: z.string().optional(),
    },
    async ({ log_path, query, context_lines, max_results, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "search_logs",
                log_path,
                query,
                context_lines,
                max_results,
                instructions: `Use Grep to search for "${query}" in ${log_path} with ${context_lines} lines of context. Limit to ${max_results} results. Format results with timestamps, log levels, and surrounding context. Group related matches together.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 3: Generate logging recommendations for codebase
  server.tool(
    "log_recommend",
    "Analyze codebase and recommend where to add structured logging for better observability",
    {
      directory: z.string().describe("Project source directory"),
      framework: z
        .string()
        .optional()
        .describe("Logging framework in use (e.g., winston, pino, log4j)"),
      api_key: z.string().optional(),
    },
    async ({ directory, framework, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "recommend_logging",
                directory,
                framework,
                instructions: `Scan the codebase at ${directory}. Identify: (1) Error handlers without logging, (2) API endpoints without request/response logging, (3) Database queries without timing logs, (4) External API calls without error logging, (5) Background jobs without start/complete/fail logs. For each gap, suggest specific structured log statements with appropriate levels, context fields, and correlation IDs. ${framework ? `Use ${framework} syntax.` : "Detect the logging framework in use."}`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 4: Correlate logs across services (Pro)
  server.tool(
    "log_correlate",
    "Correlate log entries across multiple services using request IDs or timestamps (Pro feature)",
    {
      log_paths: z
        .array(z.string())
        .describe("Paths to log files from different services"),
      correlation_field: z
        .string()
        .default("requestId")
        .describe("Field to correlate on"),
      target_id: z
        .string()
        .optional()
        .describe("Specific correlation ID to trace"),
      api_key: z.string().optional(),
    },
    async ({ log_paths, correlation_field, target_id, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: "Log correlation is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
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
                action: "correlate_logs",
                log_paths,
                correlation_field,
                target_id,
                instructions: `Read all log files: ${log_paths.join(", ")}. ${target_id ? `Find all entries with ${correlation_field}="${target_id}".` : `Find common ${correlation_field} values across files.`} Build a timeline showing the request flow across services. Identify where delays or errors occurred. Output a trace visualization.`,
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
