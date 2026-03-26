import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerReadmeGenTools(server: McpServer) {
  server.tool(
    "readme_generate",
    "Generate a comprehensive README.md from project source code and configuration",
    {
      project_name: z.string().describe("Name of the project"),
      source_summary: z.string().describe("Summary of project source code, structure, and purpose"),
      language: z.string().optional().describe("Primary programming language"),
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
                action: "generate_readme",
                instructions:
                  "Analyze the provided project summary and generate a complete README.md. Include sections for project title, description, features, installation, usage with examples, configuration, contributing guidelines, and license. Tailor the content to the detected language and framework.",
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
    "readme_add_badges",
    "Add status badges (CI, coverage, version, license) to an existing README",
    {
      readme_content: z.string().describe("Current README content"),
      repo_url: z.string().optional().describe("Repository URL for generating badge links"),
      badges: z.array(z.string()).optional().describe("List of badge types to add (e.g., 'ci', 'coverage', 'npm', 'license')"),
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
                action: "add_readme_badges",
                instructions:
                  "Parse the existing README content and add appropriate status badges at the top, just below the title. Generate badges using shields.io for the requested types (CI status, code coverage, npm version, license, etc.). If a repo URL is provided, link badges to the appropriate services. Preserve all existing content.",
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
    "readme_add_api_reference",
    "Generate and add an API reference section to a README from source code (Pro)",
    {
      readme_content: z.string().describe("Current README content"),
      source_code: z.string().describe("Source code to extract API reference from"),
      format: z.string().optional().describe("Output format: 'table' or 'detailed'"),
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
                    "This tool requires a Pro subscription. Upgrade to Pro to automatically generate and insert API reference documentation into your README.",
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
                action: "add_api_reference",
                instructions:
                  "Extract all public functions, classes, and methods from the provided source code. Generate a formatted API reference section with signatures, parameter descriptions, return types, and usage examples. Insert the API reference section into the README at the appropriate location.",
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
