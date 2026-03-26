import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerFileStorageTools(server: McpServer) {
  server.tool(
    "storage_generate_abstraction",
    "Generate file storage abstraction layer",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "storage_generate_abstraction", directory, instructions: "Generate file storage abstraction layer in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
      };
    }
  );

  server.tool(
    "storage_setup_s3",
    "Generate S3 storage integration",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "storage_setup_s3", directory, instructions: "Generate S3 storage integration in the specified directory." }, null, 2) }],
      };
    }
  );

  server.tool(
    "storage_setup_local",
    "Generate local file storage with streaming (Pro feature)",
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
        content: [{ type: "text" as const, text: JSON.stringify({ action: "storage_setup_local", directory, instructions: "Generate local file storage with streaming in the specified directory." }, null, 2) }],
      };
    }
  );
}
