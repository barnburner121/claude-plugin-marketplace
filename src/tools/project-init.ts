import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerProjectInitTools(server: McpServer) {
  server.tool(
    "init_generate_scaffold",
    "Generate a complete project scaffold with directory structure and configuration",
    {
      project_name: z.string().describe("Name of the project"),
      project_type: z.enum(["api", "web-app", "cli", "library", "monorepo"]).describe("Type of project"),
      language: z.string().describe("Programming language (e.g. typescript, go, python, rust)"),
      package_manager: z.string().optional().describe("Package manager (e.g. npm, pnpm, yarn, pip, cargo)"),
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
                action: "generate_scaffold",
                instructions: `Generate a project scaffold for '${params.project_name}' as a '${params.project_type}' project in '${params.language}'${params.package_manager ? ` using ${params.package_manager}` : ""}. Create directory structure with src, tests, config, and docs directories. Include package manifest, tsconfig/pyproject/go.mod as appropriate, .gitignore, .editorconfig, and environment variable template.`,
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
    "init_add_tooling",
    "Add development tooling to a project (linting, formatting, testing)",
    {
      project_name: z.string().describe("Name of the project"),
      language: z.string().describe("Programming language"),
      tools: z.array(z.string()).optional().describe("Tools to add (e.g. eslint, prettier, jest, husky)"),
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
                action: "add_tooling",
                instructions: `Add development tooling to project '${params.project_name}' in '${params.language}'. ${params.tools ? `Configure: ${params.tools.join(", ")}.` : "Add standard linter, formatter, test runner, and pre-commit hooks."} Generate configuration files with sensible defaults, add npm scripts or Makefile targets, and configure IDE settings for VS Code integration.`,
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
    "init_configure_ci",
    "Configure CI/CD pipeline for the project with automated checks (Pro)",
    {
      project_name: z.string().describe("Name of the project"),
      ci_platform: z.enum(["github-actions", "gitlab-ci", "circleci", "jenkins"]).describe("CI/CD platform"),
      language: z.string().describe("Programming language"),
      deploy_target: z.string().optional().describe("Deployment target (e.g. aws, gcp, vercel, k8s)"),
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
                { action: "upgrade_required", instructions: "The init_configure_ci tool requires a Pro subscription. Please upgrade to access CI/CD configuration features." },
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
                action: "configure_ci",
                instructions: `Configure CI/CD pipeline for project '${params.project_name}' on '${params.ci_platform}' for '${params.language}'${params.deploy_target ? ` deploying to '${params.deploy_target}'` : ""}. Include stages for lint, test, build, security scan, and deploy. Add caching, artifact management, environment-specific configurations, branch protection rules, and status checks. Configure secrets management and notification integrations.`,
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
