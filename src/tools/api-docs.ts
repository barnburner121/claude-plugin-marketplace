import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerApiDocsTools(server: McpServer) {
  server.tool(
    "docs_generate_openapi",
    "Generate an OpenAPI 3.x specification from source code, routes, or endpoint definitions",
    {
      source_code: z.string().describe("Source code or route definitions to generate OpenAPI spec from"),
      title: z.string().optional().describe("API title for the spec"),
      version: z.string().optional().describe("API version string"),
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
                action: "generate_openapi_spec",
                instructions:
                  "Analyze the provided source code and extract all API endpoints, request/response schemas, parameters, and authentication requirements. Generate a complete OpenAPI 3.x specification in YAML format. Include proper descriptions, example values, and response codes for each endpoint.",
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
    "docs_generate_swagger_ui",
    "Generate a Swagger UI HTML page from an OpenAPI specification",
    {
      openapi_spec: z.string().describe("OpenAPI specification in JSON or YAML format"),
      theme: z.string().optional().describe("Swagger UI theme (e.g., 'default', 'dark')"),
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
                action: "generate_swagger_ui",
                instructions:
                  "Take the provided OpenAPI specification and generate a self-contained Swagger UI HTML page. Include the Swagger UI CSS and JS from CDN, configure the spec inline, and apply the requested theme. The output should be a single HTML file that can be opened in a browser to interactively explore the API.",
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
    "docs_validate_spec",
    "Validate an OpenAPI specification for errors, warnings, and best practice violations (Pro)",
    {
      openapi_spec: z.string().describe("OpenAPI specification in JSON or YAML format"),
      strict: z.boolean().optional().describe("Enable strict validation mode"),
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
                  instructions:
                    "This tool requires a Pro subscription. Upgrade to Pro to validate OpenAPI specs for errors, warnings, and best practice violations.",
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
                action: "validate_openapi_spec",
                instructions:
                  "Parse the provided OpenAPI specification and perform comprehensive validation. Check for structural errors, missing required fields, invalid references, schema inconsistencies, and best practice violations. Return a detailed report with errors, warnings, and suggestions for improvement.",
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
