import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGithubActionsGenTools(server: McpServer) {
  server.tool(
    "gha_generate_workflow",
    "Generate a GitHub Actions workflow YAML with triggers and jobs",
    {
      workflow_name: z.string().describe("Name of the workflow"),
      trigger: z.enum(["push", "pull_request", "schedule", "workflow_dispatch"]).describe("Primary trigger event"),
      language: z.string().describe("Programming language or platform (e.g. node, python, go)"),
      branch: z.string().optional().describe("Branch filter (default main)"),
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
                action: "generate_workflow",
                instructions: `Generate a GitHub Actions workflow named '${params.workflow_name}' triggered on '${params.trigger}' for branch '${params.branch ?? "main"}' using '${params.language}'. Include checkout, setup, install, lint, test, and build steps. Add concurrency groups, permissions, and timeout settings.`,
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
    "gha_add_caching",
    "Add caching steps to a GitHub Actions workflow for faster builds",
    {
      language: z.string().describe("Language/package manager (e.g. node/npm, python/pip, go)"),
      cache_paths: z.array(z.string()).optional().describe("Additional paths to cache"),
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
                action: "add_caching",
                instructions: `Add caching configuration to a GitHub Actions workflow for '${params.language}'. Use actions/cache with appropriate cache keys based on lockfile hashes, restore keys for fallback, and ${params.cache_paths ? `additional cache paths: ${params.cache_paths.join(", ")}` : "standard cache paths for the language"}.`,
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
    "gha_add_matrix",
    "Add matrix strategy to a GitHub Actions workflow for multi-version testing",
    {
      dimension: z.string().describe("Matrix dimension name (e.g. node-version, os)"),
      values: z.array(z.string()).describe("Matrix values to test against"),
      fail_fast: z.boolean().optional().describe("Stop on first failure (default false)"),
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
                action: "add_matrix",
                instructions: `Add a matrix strategy to the GitHub Actions workflow with dimension '${params.dimension}' testing values: [${params.values.join(", ")}]. Set fail-fast to ${params.fail_fast ?? false}. Include exclude/include examples for specific combinations and max-parallel setting.`,
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
    "gha_optimize",
    "Optimize a GitHub Actions workflow for speed and cost reduction (Pro)",
    {
      workflow_yaml: z.string().describe("YAML content of the workflow to optimize"),
      optimize_for: z.enum(["speed", "cost", "both"]).optional().describe("Optimization target"),
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
                { action: "upgrade_required", instructions: "The gha_optimize tool requires a Pro subscription. Please upgrade to access GitHub Actions workflow optimization features." },
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
                action: "optimize_workflow",
                instructions: `Optimize the GitHub Actions workflow for '${params.optimize_for ?? "both"}'. Analyze job dependencies for parallelization, add caching layers, consolidate redundant steps, use composite actions, minimize runner time, add path filters to skip unnecessary runs, and suggest self-hosted runner opportunities.`,
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
