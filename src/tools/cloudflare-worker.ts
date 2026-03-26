import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCloudflareWorkerTools(server: McpServer) {
  server.tool(
    "cf_generate_worker",
    "Generate a Cloudflare Worker script with routing, middleware, and environment bindings",
    {
      name: z.string().describe("Worker name"),
      template: z.enum(["fetch-handler", "scheduled", "queue-consumer", "durable-object"]).describe("Worker template type"),
      typescript: z.boolean().optional().describe("Use TypeScript (default true)"),
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
                action: "generate_cloudflare_worker",
                instructions: `Generate a Cloudflare Worker named '${params.name}' using the ${params.template} template${params.typescript !== false ? " in TypeScript" : ""}. Include wrangler.toml configuration, environment variable bindings, and error handling middleware.`,
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
    "cf_add_kv_storage",
    "Add Cloudflare KV namespace bindings and helper utilities to a Worker",
    {
      worker_name: z.string().describe("Worker name"),
      namespace: z.string().describe("KV namespace name"),
      operations: z.array(z.enum(["get", "put", "delete", "list"])).describe("KV operations to scaffold"),
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
                action: "add_kv_storage",
                instructions: `Add KV namespace '${params.namespace}' to Worker '${params.worker_name}'. Generate helper functions for operations: ${params.operations.join(", ")}. Include wrangler.toml bindings, typed interfaces, and TTL management patterns.`,
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
    "cf_configure_routes",
    "Configure Worker routes, custom domains, and path-based routing (Pro)",
    {
      worker_name: z.string().describe("Worker name"),
      routes: z.array(z.string()).describe("Route patterns (e.g. example.com/api/*)"),
      custom_domain: z.string().optional().describe("Custom domain to bind"),
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
                action: "configure_worker_routes",
                instructions: `Configure routes for Worker '${params.worker_name}': ${params.routes.join(", ")}. ${params.custom_domain ? `Bind custom domain '${params.custom_domain}'.` : ""} Include route matching logic, fallback handlers, and wrangler.toml route configuration.`,
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
