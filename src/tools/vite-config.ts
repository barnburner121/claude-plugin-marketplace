import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerViteConfigTools(server: McpServer) {
  server.tool(
    "generate_vite_config",
    "Generate a Vite configuration for any frontend framework",
    {
      framework: z.enum(["react", "vue", "svelte", "solid", "preact", "vanilla"]).describe("Frontend framework"),
      features: z.array(z.enum(["pwa", "ssr", "css-modules", "tailwind", "path-aliases", "env-types"])).optional().describe("Features to enable"),
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
                action: "generate_vite_config",
                instructions: `Generate vite.config.ts for ${params.framework} with features: ${(params.features || ["path-aliases", "env-types"]).join(", ")}. Include the framework plugin, resolve.alias configuration, build optimization settings, dev server proxy config, and environment variable typing in env.d.ts. Add comments explaining each configuration option.`,
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
    "generate_vite_plugins",
    "Generate custom Vite plugin configurations for build optimization",
    {
      plugins: z.array(z.string()).describe("Plugin names or categories to configure"),
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
                action: "generate_vite_plugins",
                instructions: `Configure Vite plugins: ${params.plugins.join(", ")}. For each plugin, generate the import, configuration object with recommended settings, and explain what the plugin does. Include rollup output manualChunks for code splitting, compression plugin for gzip/brotli, and visualizer plugin for bundle analysis.`,
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
    "generate_vite_ssr_config",
    "Generate Vite SSR configuration with streaming and hydration (Pro feature)",
    {
      framework: z.enum(["react", "vue", "solid"]).describe("SSR framework"),
      streaming: z.boolean().optional().describe("Enable streaming SSR"),
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
                  instructions: "Vite SSR configuration is a Pro feature. Upgrade to Pro for streaming SSR setup, hydration strategies, and production deployment configs.",
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
                action: "generate_vite_ssr_config",
                instructions: `Generate Vite SSR configuration for ${params.framework} with ${params.streaming ? "streaming" : "string"} rendering. Include server entry point, client entry point, HTML template handling, vite.config.ts with ssr options, Express/Fastify server setup for production, and development middleware integration. Add error boundary handling and selective hydration configuration.`,
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
