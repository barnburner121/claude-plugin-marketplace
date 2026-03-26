import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGraphqlClientTools(server: McpServer) {
  server.tool(
    "gqlclient_setup_apollo",
    "Generate Apollo Client setup with cache",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "gqlclient_setup_apollo", directory, instructions: "Generate Apollo Client setup with cache in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
      };
    }
  );

  server.tool(
    "gqlclient_setup_urql",
    "Generate urql client setup",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "gqlclient_setup_urql", directory, instructions: "Generate urql client setup in the specified directory." }, null, 2) }],
      };
    }
  );

  server.tool(
    "gqlclient_generate_hooks",
    "Generate typed query/mutation hooks (Pro feature)",
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
        content: [{ type: "text" as const, text: JSON.stringify({ action: "gqlclient_generate_hooks", directory, instructions: "Generate typed query/mutation hooks in the specified directory." }, null, 2) }],
      };
    }
  );
}
