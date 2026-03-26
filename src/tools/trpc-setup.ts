import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerTrpcSetupTools(server: McpServer) {
  server.tool(
    "trpc_generate_router",
    "Generate tRPC router with procedures",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "trpc_generate_router", directory, instructions: "Generate tRPC router with procedures in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
      };
    }
  );

  server.tool(
    "trpc_generate_client",
    "Generate tRPC client with React Query",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "trpc_generate_client", directory, instructions: "Generate tRPC client with React Query in the specified directory." }, null, 2) }],
      };
    }
  );

  server.tool(
    "trpc_add_middleware",
    "Generate tRPC middleware for auth and logging (Pro feature)",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier === "free") {
        return {
          content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }],
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "trpc_add_middleware", directory, instructions: "Generate tRPC middleware for auth and logging in the specified directory." }, null, 2) }],
      };
    }
  );
}
