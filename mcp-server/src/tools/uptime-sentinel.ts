import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerUptimeSentinelTools(server: McpServer) {
  // Tool 1: Generate health check endpoints
  server.tool(
    "uptime_create_healthcheck",
    "Generate comprehensive health check endpoints for your application with dependency checks",
    {
      framework: z
        .enum(["express", "fastify", "nestjs", "flask", "django", "gin", "actix"])
        .describe("Web framework"),
      dependencies: z
        .array(
          z.enum([
            "postgres",
            "mysql",
            "redis",
            "mongodb",
            "elasticsearch",
            "rabbitmq",
            "s3",
            "external-api",
          ])
        )
        .describe("External dependencies to check"),
      api_key: z.string().optional(),
    },
    async ({ framework, dependencies, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_healthcheck",
                framework,
                dependencies,
                instructions: `Generate health check endpoints for ${framework}: (1) GET /health — basic liveness probe (always returns 200 if process is running), (2) GET /health/ready — readiness probe that checks all dependencies: ${dependencies.join(", ")}, (3) GET /health/detailed — full status with response times for each dependency (authenticated), (4) Each dependency check should have a timeout (2s default), (5) Return proper HTTP status codes (200 healthy, 503 unhealthy), (6) Include version, uptime, and memory usage in response, (7) Add middleware to exclude health endpoints from access logs.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 2: Generate uptime monitoring configuration
  server.tool(
    "uptime_create_monitors",
    "Generate monitoring configurations for uptime, SSL, and performance tracking",
    {
      endpoints: z
        .array(
          z.object({
            url: z.string(),
            name: z.string(),
            method: z.enum(["GET", "POST", "HEAD"]).default("GET"),
            expected_status: z.number().default(200),
            timeout_ms: z.number().default(5000),
          })
        )
        .describe("Endpoints to monitor"),
      check_interval_seconds: z.number().default(60),
      alert_channels: z
        .array(z.enum(["email", "slack", "pagerduty", "webhook"]))
        .default(["email"]),
      api_key: z.string().optional(),
    },
    async ({ endpoints, check_interval_seconds, alert_channels, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_monitors",
                endpoints,
                check_interval_seconds,
                alert_channels,
                instructions: `Generate a monitoring setup that: (1) Checks each endpoint every ${check_interval_seconds}s, (2) Validates HTTP status code and response time, (3) SSL certificate expiry monitoring (alert 30, 14, 7 days before), (4) Alerts via: ${alert_channels.join(", ")} when an endpoint goes down, (5) Tracks uptime percentage over 24h/7d/30d windows, (6) Generates a status page config (showing current status + incident history), (7) Implements escalation (warn after 1 failure, alert after 3 consecutive). Generate as a standalone Node.js monitoring script that can run as a cron job or long-running process.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 3: Create status page
  server.tool(
    "uptime_create_status_page",
    "Generate a public status page for your services (Pro feature)",
    {
      services: z
        .array(
          z.object({
            name: z.string(),
            description: z.string(),
            group: z.string().optional(),
          })
        )
        .describe("Services to display on status page"),
      brand: z.object({
        name: z.string(),
        primary_color: z.string().default("#10b981"),
      }),
      api_key: z.string().optional(),
    },
    async ({ services, brand, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: "Status page generation is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
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
                action: "create_status_page",
                services,
                brand,
                instructions: `Generate a static status page for ${brand.name}: (1) Single HTML file with embedded CSS (no dependencies), (2) Service list grouped by: ${[...new Set(services.map((s) => s.group || "default"))].join(", ")}, (3) Current status indicator (operational/degraded/outage) per service, (4) 90-day uptime bar chart per service, (5) Active/resolved incident timeline, (6) Subscribe to updates form (email), (7) Branded with ${brand.name} and ${brand.primary_color}, (8) Mobile responsive, (9) JSON API endpoint for programmatic status checks. Deploy as static files or serverless function.`,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool 4: Incident response runbook
  server.tool(
    "uptime_create_runbook",
    "Generate incident response runbooks for common failure scenarios",
    {
      service_name: z.string().describe("Service name"),
      infrastructure: z
        .string()
        .describe(
          "Infrastructure description (e.g., 'Node.js API on Railway with Postgres on Neon')"
        ),
      common_issues: z
        .array(z.string())
        .optional()
        .describe("Known common issues to create runbooks for"),
      api_key: z.string().optional(),
    },
    async ({ service_name, infrastructure, common_issues, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "create_runbook",
                service_name,
                infrastructure,
                common_issues,
                instructions: `Generate incident response runbooks for ${service_name} (${infrastructure}). Create runbooks for: ${common_issues ? common_issues.join(", ") + " plus " : ""}(1) High latency / slow responses, (2) 5xx errors spike, (3) Database connection failures, (4) Memory exhaustion / OOM, (5) Disk space full, (6) SSL certificate expired, (7) Deployment rollback needed. Each runbook should have: severity level, who to notify, step-by-step diagnosis, mitigation steps, root cause analysis template, and post-incident review template. Output as a Markdown document.`,
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
