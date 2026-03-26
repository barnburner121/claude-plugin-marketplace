import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerDockerComposeGenTools(server: McpServer) {
  server.tool(
    "compose_generate",
    "Generate a Docker Compose file with service definitions and networking",
    {
      project_name: z.string().describe("Name of the project"),
      services: z.array(z.string()).describe("List of service names to include"),
      compose_version: z.string().optional().describe("Compose file version (default 3.9)"),
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
                action: "generate_compose",
                instructions: `Generate a Docker Compose file for project '${params.project_name}' with version '${params.compose_version ?? "3.9"}' including services: ${params.services.join(", ")}. Configure shared networks, volumes, environment variable files, and health checks for each service.`,
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
    "compose_add_service",
    "Add a new service definition to an existing Docker Compose file",
    {
      service_name: z.string().describe("Name of the service to add"),
      image: z.string().describe("Docker image for the service"),
      ports: z.array(z.string()).optional().describe("Port mappings (e.g. ['8080:80'])"),
      depends_on: z.array(z.string()).optional().describe("Service dependencies"),
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
                action: "add_service",
                instructions: `Add service '${params.service_name}' using image '${params.image}' to the Docker Compose file. ${params.ports ? `Map ports: ${params.ports.join(", ")}.` : ""} ${params.depends_on ? `Depends on: ${params.depends_on.join(", ")}.` : ""} Include health check, restart policy, and resource limits.`,
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
    "compose_optimize",
    "Optimize a Docker Compose file for production readiness (Pro)",
    {
      compose_yaml: z.string().describe("YAML content of the Docker Compose file"),
      target: z.enum(["development", "staging", "production"]).optional().describe("Optimization target environment"),
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
                { action: "upgrade_required", instructions: "The compose_optimize tool requires a Pro subscription. Please upgrade to access Docker Compose optimization features." },
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
                action: "optimize_compose",
                instructions: `Optimize the Docker Compose file for '${params.target ?? "production"}'. Add resource limits, logging drivers, restart policies, read-only root filesystems, tmpfs mounts, security options, and multi-stage build suggestions. Remove unnecessary exposed ports and volumes.`,
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
