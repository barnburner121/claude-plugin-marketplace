import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerBundleAnalyzerTools(server: McpServer) {
  server.tool(
    "bundle_analyze_size",
    "Analyze JavaScript bundle size from package.json dependencies or build output",
    {
      package_json: z.string().describe("package.json content or dependency list to analyze"),
      build_stats: z.string().optional().describe("Webpack/Vite/Rollup build stats JSON for detailed analysis"),
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
                action: "analyze_bundle_size",
                instructions:
                  "Analyze the project dependencies and build stats to estimate bundle size. For each dependency, estimate the minified and gzipped size contribution. Identify the total bundle size, the largest contributors, and dependencies that may be unexpectedly large. Check for dependencies that include unnecessary sub-modules or polyfills. Provide a size breakdown table sorted by impact.",
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
    "bundle_find_heavy_deps",
    "Identify heavy dependencies and suggest lighter alternatives",
    {
      package_json: z.string().describe("package.json content with dependencies to analyze"),
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
                action: "find_heavy_dependencies",
                instructions:
                  "Analyze each dependency in package.json and identify packages that are disproportionately large for their functionality. For each heavy dependency, provide its estimated size, what it is used for, and suggest lighter alternatives (e.g., date-fns instead of moment, preact instead of react for small apps). Flag dependencies that could be replaced with native APIs (e.g., fetch instead of axios, native Array methods instead of lodash). Estimate potential bundle size savings for each suggested replacement.",
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
    "bundle_optimize",
    "Generate a comprehensive bundle optimization plan with specific code changes (Pro)",
    {
      package_json: z.string().describe("package.json content"),
      build_config: z.string().optional().describe("Build configuration (webpack.config.js, vite.config.ts, etc.)"),
      source_imports: z.string().optional().describe("Import statements from source files for tree-shaking analysis"),
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
                    "This tool requires a Pro subscription. Upgrade to Pro to get a comprehensive bundle optimization plan with specific code changes, code splitting strategies, tree-shaking improvements, and build configuration updates.",
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
                action: "optimize_bundle",
                instructions:
                  "Generate a comprehensive bundle optimization plan. Analyze imports for tree-shaking opportunities (convert namespace imports to named imports), identify code splitting points for lazy loading, suggest dynamic imports for route-based splitting, optimize build configuration for better chunking, recommend compression settings, and provide specific code changes for each optimization. Estimate the total size reduction and provide a prioritized implementation checklist.",
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
