import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPythonSetupTools(server: McpServer) {
  server.tool(
    "generate_pyproject_toml",
    "Generate a pyproject.toml file with build system, dependencies, and project metadata",
    {
      project_name: z.string().describe("Name of the Python project"),
      python_version: z.string().optional().describe("Minimum Python version (e.g. 3.11)"),
      build_system: z.enum(["setuptools", "hatchling", "flit", "poetry"]).optional().describe("Build backend to use"),
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
                action: "generate_pyproject_toml",
                instructions: `Generate a pyproject.toml for project '${params.project_name}' using ${params.build_system || "setuptools"} as the build backend. Target Python >=${params.python_version || "3.11"}. Include sections for [project], [build-system], [project.optional-dependencies] with dev/test groups, and [tool.pytest.ini_options]. Add classifiers, license, and URLs.`,
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
    "setup_python_venv",
    "Generate commands and configuration for Python virtual environment setup",
    {
      project_dir: z.string().describe("Project directory path"),
      manager: z.enum(["venv", "virtualenv", "conda", "uv"]).optional().describe("Virtual environment manager"),
      python_version: z.string().optional().describe("Python version to use"),
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
                action: "setup_python_venv",
                instructions: `Create a virtual environment in '${params.project_dir}' using ${params.manager || "venv"}. Generate the creation command, activation scripts for bash/zsh/fish/PowerShell, a .python-version file targeting ${params.python_version || "3.11"}, and a .gitignore entry for the venv directory. Include pip upgrade and initial dependency install steps.`,
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
    "configure_python_linting",
    "Generate linting and formatting configuration for a Python project (Pro feature)",
    {
      linters: z.array(z.enum(["ruff", "flake8", "pylint", "mypy", "black", "isort"])).optional().describe("Linters/formatters to configure"),
      strict: z.boolean().optional().describe("Enable strict mode with maximum rules"),
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
                  instructions: "Python linting configuration is a Pro feature. Upgrade to Pro to access advanced linting configs with ruff, mypy, and custom rule sets.",
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
                action: "configure_python_linting",
                instructions: `Generate configuration for linters: ${(params.linters || ["ruff", "mypy"]).join(", ")}. Strict mode: ${params.strict ?? false}. Include pyproject.toml [tool.*] sections, pre-commit hooks config, and a Makefile with lint/format targets. Add explanations for each enabled rule category.`,
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
