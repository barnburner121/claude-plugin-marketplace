import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerDataMapperTools(server: McpServer) {
  server.tool(
    "mapper_create_layer",
    "Generate data mapping layer between formats",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "mapper_create_layer", directory, instructions: "Generate data mapping layer between formats in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
      };
    }
  );

  server.tool(
    "mapper_generate_transforms",
    "Generate transformation functions",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "mapper_generate_transforms", directory, instructions: "Generate transformation functions in the specified directory." }, null, 2) }],
      };
    }
  );

  server.tool(
    "mapper_add_validation",
    "Add validation to mapping layer (Pro feature)",
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
        content: [{ type: "text" as const, text: JSON.stringify({ action: "mapper_add_validation", directory, instructions: "Add validation to mapping layer in the specified directory." }, null, 2) }],
      };
    }
  );
}
