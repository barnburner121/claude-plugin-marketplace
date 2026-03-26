import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPasskeySetupTools(server: McpServer) {
  server.tool(
    "passkey_generate_registration",
    "Generate WebAuthn registration flow",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "passkey_generate_registration", directory, instructions: "Generate WebAuthn registration flow in the specified directory. Analyze the project and generate appropriate configurations." }, null, 2) }],
      };
    }
  );

  server.tool(
    "passkey_generate_auth",
    "Generate WebAuthn authentication flow",
    {
      directory: z.string().describe("Project directory"),
      api_key: z.string().optional(),
    },
    async ({ directory, api_key }) => {
      const { allowed, tier } = checkRateLimit(api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [{ type: "text" as const, text: JSON.stringify({ action: "passkey_generate_auth", directory, instructions: "Generate WebAuthn authentication flow in the specified directory." }, null, 2) }],
      };
    }
  );

  server.tool(
    "passkey_setup_server",
    "Set up passkey server-side validation (Pro feature)",
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
        content: [{ type: "text" as const, text: JSON.stringify({ action: "passkey_setup_server", directory, instructions: "Set up passkey server-side validation in the specified directory." }, null, 2) }],
      };
    }
  );
}
