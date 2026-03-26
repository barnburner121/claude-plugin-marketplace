import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPwaBuilderTools(server: McpServer) {
  server.tool(
    "pwa_generate_manifest",
    "Generate a web app manifest file with icons, theme colors, and display settings",
    {
      name: z.string().describe("Application name"),
      short_name: z.string().describe("Short name for home screen"),
      theme_color: z.string().optional().describe("Theme color (hex)"),
      display: z.enum(["standalone", "fullscreen", "minimal-ui", "browser"]).optional().describe("Display mode"),
      orientation: z.enum(["portrait", "landscape", "any"]).optional().describe("Preferred orientation"),
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
                action: "generate_pwa_manifest",
                instructions: `Generate a manifest.json for PWA '${params.name}' (short: '${params.short_name}'). ${params.theme_color ? `Theme color: ${params.theme_color}.` : ""} Display: ${params.display || "standalone"}. ${params.orientation ? `Orientation: ${params.orientation}.` : ""} Include icon definitions (192x192, 512x512), start_url, scope, background_color, and categories.`,
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
    "pwa_generate_sw",
    "Generate a service worker with caching strategies and lifecycle management",
    {
      strategy: z.enum(["cache-first", "network-first", "stale-while-revalidate", "cache-only"]).describe("Primary caching strategy"),
      precache_routes: z.array(z.string()).optional().describe("Routes to precache"),
      use_workbox: z.boolean().optional().describe("Use Workbox library"),
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
                action: "generate_service_worker",
                instructions: `Generate a service worker using the '${params.strategy}' caching strategy. ${params.use_workbox ? "Use Workbox library with workbox-webpack-plugin." : "Use native Service Worker API."} ${params.precache_routes ? `Precache routes: ${params.precache_routes.join(", ")}.` : ""} Include install, activate, and fetch event handlers, cache versioning, and update notification.`,
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
    "pwa_add_offline",
    "Add offline support with background sync, IndexedDB storage, and fallback pages (Pro)",
    {
      sync_endpoints: z.array(z.string()).optional().describe("API endpoints for background sync"),
      offline_page: z.string().optional().describe("Offline fallback page path"),
      indexed_db_stores: z.array(z.string()).optional().describe("IndexedDB object store names"),
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
                action: "add_offline_support",
                instructions: `Add offline support to PWA. ${params.sync_endpoints ? `Enable background sync for: ${params.sync_endpoints.join(", ")}.` : ""} ${params.offline_page ? `Set offline fallback to '${params.offline_page}'.` : ""} ${params.indexed_db_stores ? `Create IndexedDB stores: ${params.indexed_db_stores.join(", ")}.` : ""} Include queue management, conflict resolution, and connectivity detection.`,
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
