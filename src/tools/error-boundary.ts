import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerErrorBoundaryTools(server: McpServer) {
  server.tool(
    "error_generate_boundary",
    "Generate React error boundary components with recovery and retry logic",
    {
      name: z.string().describe("Error boundary component name"),
      granularity: z.enum(["app", "route", "component", "feature"]).describe("Error boundary scope level"),
      retry: z.boolean().optional().describe("Include automatic retry logic"),
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
                action: "generate_error_boundary",
                instructions: `Generate a React error boundary component '${params.name}' at the ${params.granularity} level. ${params.retry ? "Include automatic retry with exponential backoff." : ""} Implement getDerivedStateFromError, componentDidCatch, reset functionality, and TypeScript props interface.`,
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
    "error_generate_fallback",
    "Generate fallback UI components for error states with user-friendly messaging",
    {
      style: z.enum(["minimal", "detailed", "branded", "interactive"]).describe("Fallback UI style"),
      include_report: z.boolean().optional().describe("Include error reporting button"),
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
                action: "generate_fallback_ui",
                instructions: `Generate a ${params.style} error fallback UI component. ${params.include_report ? "Include an error reporting button that captures stack traces." : ""} Display user-friendly error messages, retry button, navigation options, and responsive styling.`,
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
    "error_setup_reporting",
    "Set up error reporting and monitoring with Sentry, LogRocket, or custom solutions (Pro)",
    {
      provider: z.enum(["sentry", "logrocket", "bugsnag", "datadog", "custom"]).describe("Error reporting provider"),
      framework: z.enum(["react", "next", "vue", "angular", "node"]).describe("Application framework"),
      environments: z.array(z.string()).optional().describe("Environments to enable reporting for"),
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
              text: JSON.stringify({ error: "This tool requires a Pro subscription." }, null, 2),
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
                action: "setup_error_reporting",
                instructions: `Set up ${params.provider} error reporting for a ${params.framework} application. ${params.environments ? `Enable for environments: ${params.environments.join(", ")}.` : ""} Include SDK initialization, source maps configuration, user context, breadcrumbs, performance monitoring, and alert rules.`,
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
