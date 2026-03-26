import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerMonitoringStackTools(server: McpServer) {
  server.tool(
    "monitor_setup_prometheus",
    "Generate Prometheus configuration with scrape targets and rules",
    {
      service_name: z.string().describe("Name of the service to monitor"),
      scrape_interval: z.string().optional().describe("Scrape interval (default 15s)"),
      metrics_path: z.string().optional().describe("Metrics endpoint path (default /metrics)"),
      targets: z.array(z.string()).optional().describe("List of scrape targets"),
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
                action: "setup_prometheus",
                instructions: `Generate Prometheus configuration for service '${params.service_name}' with scrape interval '${params.scrape_interval ?? "15s"}' on path '${params.metrics_path ?? "/metrics"}'. ${params.targets ? `Include targets: ${params.targets.join(", ")}.` : "Use service discovery."} Add relabeling rules, recording rules for common aggregations, and retention settings.`,
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
    "monitor_setup_grafana",
    "Generate Grafana dashboard JSON with panels and data sources",
    {
      dashboard_name: z.string().describe("Name of the Grafana dashboard"),
      service_name: z.string().describe("Service to create dashboard for"),
      panel_types: z.array(z.string()).optional().describe("Panel types to include (e.g. graph, stat, table)"),
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
                action: "setup_grafana",
                instructions: `Generate a Grafana dashboard named '${params.dashboard_name}' for service '${params.service_name}'. ${params.panel_types ? `Include panel types: ${params.panel_types.join(", ")}.` : "Include graph, stat, and table panels."} Add panels for request rate, error rate, latency percentiles, resource usage, and saturation metrics. Configure template variables for namespace and instance filtering.`,
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
    "monitor_create_alerts",
    "Create alerting rules for Prometheus Alertmanager (Pro)",
    {
      service_name: z.string().describe("Service to create alerts for"),
      severity_levels: z.array(z.string()).optional().describe("Severity levels (e.g. critical, warning, info)"),
      notification_channel: z.string().optional().describe("Notification channel (slack, pagerduty, email)"),
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
                { action: "upgrade_required", instructions: "The monitor_create_alerts tool requires a Pro subscription. Please upgrade to access alert rule creation features." },
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
                action: "create_alerts",
                instructions: `Create Prometheus alerting rules for service '${params.service_name}' with severity levels: ${(params.severity_levels ?? ["critical", "warning"]).join(", ")}. Include alerts for high error rate, elevated latency, pod restarts, resource exhaustion, and SLO burn rate. ${params.notification_channel ? `Configure Alertmanager routes for '${params.notification_channel}' notifications.` : ""} Add inhibition rules and grouping configuration.`,
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
