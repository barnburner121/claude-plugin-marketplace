import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerRustCargoTools(server: McpServer) {
  server.tool(
    "generate_cargo_toml",
    "Generate a Cargo.toml with dependencies, features, and build profiles",
    {
      package_name: z.string().describe("Crate name"),
      crate_type: z.enum(["bin", "lib", "proc-macro"]).optional().describe("Type of crate"),
      edition: z.enum(["2021", "2024"]).optional().describe("Rust edition"),
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
                action: "generate_cargo_toml",
                instructions: `Generate Cargo.toml for crate '${params.package_name}' as a ${params.crate_type || "bin"} crate using edition ${params.edition || "2021"}. Include [package] metadata, [dependencies] with popular crates for the type, [dev-dependencies] for testing, [profile.release] with LTO and codegen optimizations, and [lints] section with clippy configuration.`,
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
    "setup_rust_workspace",
    "Configure a Cargo workspace with multiple crates",
    {
      workspace_name: z.string().describe("Workspace root name"),
      members: z.array(z.string()).describe("Workspace member crate names"),
      shared_deps: z.boolean().optional().describe("Use workspace-level dependency inheritance"),
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
                action: "setup_rust_workspace",
                instructions: `Create a Cargo workspace '${params.workspace_name}' with members: ${params.members.join(", ")}. ${params.shared_deps !== false ? "Use [workspace.dependencies] for dependency inheritance across members." : "Each member manages its own dependencies."} Generate root Cargo.toml with [workspace] section, member Cargo.toml files, and a justfile/Makefile with build, test, and check commands for the entire workspace.`,
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
    "generate_rust_ci",
    "Generate CI/CD configuration for Rust projects (Pro feature)",
    {
      ci_provider: z.enum(["github-actions", "gitlab-ci", "circleci"]).optional().describe("CI provider"),
      targets: z.array(z.string()).optional().describe("Cross-compilation targets"),
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
                  instructions: "Rust CI configuration generation is a Pro feature. Upgrade to Pro to generate CI pipelines with cross-compilation, caching, and release automation.",
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
                action: "generate_rust_ci",
                instructions: `Generate ${params.ci_provider || "github-actions"} CI config for Rust. Include jobs for: clippy linting, cargo fmt check, unit/integration tests, cargo audit, code coverage with llvm-cov, and binary builds for targets: ${(params.targets || ["x86_64-unknown-linux-gnu", "aarch64-apple-darwin"]).join(", ")}. Add Rust toolchain caching and cargo registry caching.`,
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
