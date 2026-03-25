#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "{{PLUGIN_NAME}}",
  version: "1.0.0",
});

// --- Rate limiting for freemium tier ---
const FREE_TIER_LIMIT = 50; // requests per day
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(apiKey?: string): boolean {
  if (apiKey && apiKey.startsWith("pro_")) return true; // Pro users unlimited
  const key = apiKey ?? "anonymous";
  const now = Date.now();
  const record = requestCounts.get(key);
  if (!record || now > record.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + 86400000 });
    return true;
  }
  if (record.count >= FREE_TIER_LIMIT) return false;
  record.count++;
  return true;
}

// --- Tools ---
// TODO: Replace these example tools with real implementations

server.tool(
  "{{PLUGIN_NAME}}_example",
  "Example tool - replace with real implementation",
  {
    input: z.string().describe("Input to process"),
  },
  async ({ input }) => {
    if (!checkRateLimit()) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Rate limit exceeded. Upgrade to Pro for unlimited access.",
          },
        ],
      };
    }
    return {
      content: [{ type: "text" as const, text: `Processed: ${input}` }],
    };
  }
);

// --- Start server ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
