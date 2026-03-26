import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGitWorkflowTools(server: McpServer) {
  server.tool(
    "git_generate_branching",
    "Generate a Git branching strategy configuration and documentation",
    {
      strategy: z.enum(["gitflow", "trunk-based", "github-flow", "release-flow"]).describe("Branching strategy"),
      release_cadence: z.string().optional().describe("Release cadence (e.g. weekly, biweekly, continuous)"),
      team_size: z.number().optional().describe("Team size for strategy tuning"),
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
                action: "generate_branching",
                instructions: `Generate a '${params.strategy}' branching strategy${params.release_cadence ? ` with ${params.release_cadence} releases` : ""}${params.team_size ? ` optimized for a team of ${params.team_size}` : ""}. Define branch naming conventions, merge strategies, protected branches, release tagging format, hotfix procedures, and environment-to-branch mappings. Include a visual branch flow diagram description.`,
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
    "git_setup_hooks",
    "Set up Git hooks for code quality enforcement",
    {
      hooks: z.array(z.string()).describe("Hooks to set up (e.g. pre-commit, commit-msg, pre-push)"),
      language: z.string().describe("Programming language of the project"),
      tool: z.enum(["husky", "lefthook", "pre-commit", "custom"]).optional().describe("Hook management tool"),
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
                action: "setup_hooks",
                instructions: `Set up Git hooks using '${params.tool ?? "husky"}' for a '${params.language}' project. Configure hooks: ${params.hooks.join(", ")}. Include lint-staged for pre-commit, conventional commit validation for commit-msg, and test execution for pre-push. Add installation instructions and bypass escape hatch documentation.`,
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
    "git_generate_templates",
    "Generate Git templates for PRs, issues, and commit conventions (Pro)",
    {
      platform: z.enum(["github", "gitlab", "bitbucket"]).describe("Git hosting platform"),
      project_type: z.string().optional().describe("Project type for tailored templates"),
      include_codeowners: z.boolean().optional().describe("Generate CODEOWNERS file"),
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
                { action: "upgrade_required", instructions: "The git_generate_templates tool requires a Pro subscription. Please upgrade to access Git template generation features." },
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
                action: "generate_templates",
                instructions: `Generate Git templates for '${params.platform}'${params.project_type ? ` tailored for '${params.project_type}' projects` : ""}. Create PR template with checklist, bug report and feature request issue templates, contributing guidelines, and commit message convention documentation. ${params.include_codeowners ? "Generate a CODEOWNERS file with team-based ownership rules." : ""} Add labels configuration and milestone templates.`,
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
