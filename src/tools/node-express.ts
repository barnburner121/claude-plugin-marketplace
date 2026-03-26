import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerNodeExpressTools(server: McpServer) {
  server.tool(
    "scaffold_express_project",
    "Generate an Express.js project with TypeScript and best practices",
    {
      project_name: z.string().describe("Project name"),
      typescript: z.boolean().optional().describe("Use TypeScript (default true)"),
      orm: z.enum(["prisma", "drizzle", "typeorm", "sequelize", "none"]).optional().describe("ORM to configure"),
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
                action: "scaffold_express_project",
                instructions: `Scaffold an Express.js project '${params.project_name}' ${params.typescript !== false ? "with TypeScript" : "with JavaScript"}. Generate src/routes/, src/controllers/, src/middleware/, src/services/, src/models/ directories. Include app.ts, server.ts, error handler middleware, request validation with zod, ${params.orm || "prisma"} ORM setup, and package.json with scripts for dev/build/start/test.`,
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
    "generate_express_middleware",
    "Generate Express middleware for common concerns",
    {
      middleware_types: z.array(z.enum(["auth", "validation", "rate-limit", "cors", "logging", "error-handler", "compression"])).describe("Middleware types to generate"),
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
                action: "generate_express_middleware",
                instructions: `Generate Express middleware for: ${params.middleware_types.join(", ")}. Each middleware should be in its own file with TypeScript types for Request extensions. Include proper error propagation with next(), async wrapper for async middleware, configuration options via factory pattern, and unit tests with supertest.`,
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
    "generate_express_api_routes",
    "Generate RESTful API routes with validation and OpenAPI docs (Pro feature)",
    {
      resources: z.array(z.string()).describe("Resource names for CRUD routes"),
      versioned: z.boolean().optional().describe("Use API versioning"),
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
                  instructions: "Express API route generation is a Pro feature. Upgrade to Pro for auto-generated CRUD routes with validation, pagination, filtering, and OpenAPI documentation.",
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
                action: "generate_express_api_routes",
                instructions: `Generate RESTful API routes for resources: ${params.resources.join(", ")}. ${params.versioned ? "Use /api/v1/ prefix with version routing." : ""} Each resource gets CRUD endpoints with zod validation schemas, controller with service injection, pagination/sorting/filtering query params, and swagger-jsdoc comments for OpenAPI spec generation.`,
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
