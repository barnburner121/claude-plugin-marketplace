import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGoScaffoldTools(server: McpServer) {
  server.tool(
    "scaffold_go_project",
    "Generate a Go project directory structure following standard layout conventions",
    {
      module_path: z.string().describe("Go module path (e.g. github.com/user/project)"),
      project_type: z.enum(["cli", "api", "library", "microservice"]).optional().describe("Type of Go project"),
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
                action: "scaffold_go_project",
                instructions: `Create a Go project structure for module '${params.module_path}' of type '${params.project_type || "api"}'. Include cmd/, internal/, pkg/, api/, configs/, and scripts/ directories. Generate go.mod, main.go, Makefile, Dockerfile, and .golangci.yml. Follow golang-standards/project-layout conventions.`,
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
    "generate_go_module",
    "Generate go.mod with curated dependencies for the project type",
    {
      module_path: z.string().describe("Go module path"),
      go_version: z.string().optional().describe("Go version (e.g. 1.22)"),
      dependencies: z.array(z.string()).optional().describe("Additional dependencies to include"),
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
                action: "generate_go_module",
                instructions: `Generate go.mod for '${params.module_path}' targeting Go ${params.go_version || "1.22"}. Include recommended dependencies: ${(params.dependencies || []).join(", ") || "standard library only"}. Add go.sum generation instructions and explain dependency management with go mod tidy, go mod vendor, and go mod graph.`,
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
    "generate_go_handlers",
    "Generate HTTP handler boilerplate with middleware and routing (Pro feature)",
    {
      framework: z.enum(["stdlib", "chi", "gin", "echo", "fiber"]).optional().describe("HTTP framework to use"),
      endpoints: z.array(z.string()).optional().describe("Endpoint paths to generate"),
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
                  instructions: "Go handler generation is a Pro feature. Upgrade to Pro to generate production-ready HTTP handlers with middleware, validation, and error handling.",
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
                action: "generate_go_handlers",
                instructions: `Generate HTTP handlers using ${params.framework || "chi"} for endpoints: ${(params.endpoints || ["/api/health", "/api/v1/resources"]).join(", ")}. Include request/response types, input validation, error handling middleware, structured logging, and OpenAPI doc comments. Follow idiomatic Go patterns with dependency injection.`,
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
