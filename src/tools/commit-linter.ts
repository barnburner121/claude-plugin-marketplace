import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCommitLinterTools(server: McpServer) {
  server.tool(
    "commit_setup_conventional",
    "Set up conventional commit linting with commitlint configuration and rules",
    {
      preset: z.enum(["angular", "conventional", "atom", "custom"]).describe("Commit convention preset"),
      scopes: z.array(z.string()).optional().describe("Allowed commit scopes"),
      max_length: z.number().optional().describe("Maximum subject line length"),
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
                action: "setup_conventional_commits",
                instructions: `Set up conventional commit linting using the '${params.preset}' preset. ${params.scopes ? `Restrict scopes to: ${params.scopes.join(", ")}.` : ""} ${params.max_length ? `Max subject length: ${params.max_length}.` : ""} Include commitlint.config.js, package.json scripts, and CI integration.`,
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
    "commit_setup_husky",
    "Configure Husky git hooks for commit message validation and pre-commit checks",
    {
      hooks: z.array(z.enum(["commit-msg", "pre-commit", "pre-push", "prepare-commit-msg"])).describe("Git hooks to configure"),
      lint_staged: z.boolean().optional().describe("Include lint-staged configuration"),
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
                action: "setup_husky_hooks",
                instructions: `Configure Husky with git hooks: ${params.hooks.join(", ")}. ${params.lint_staged ? "Include lint-staged configuration for running linters on staged files." : ""} Include installation commands, hook scripts, and package.json postinstall setup.`,
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
    "commit_validate_history",
    "Validate and analyze existing commit history against conventional commit standards (Pro)",
    {
      range: z.string().optional().describe("Git revision range to validate (e.g. main..HEAD)"),
      fix_suggestions: z.boolean().optional().describe("Include fix suggestions for invalid commits"),
      generate_changelog: z.boolean().optional().describe("Generate a changelog from valid commits"),
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
                action: "validate_commit_history",
                instructions: `Validate commit history${params.range ? ` for range '${params.range}'` : ""} against conventional commit standards. ${params.fix_suggestions ? "Provide fix suggestions for non-conforming commits." : ""} ${params.generate_changelog ? "Generate a changelog grouped by type (feat, fix, etc.)." : ""} Report compliance percentage and common violations.`,
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
