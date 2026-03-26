import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerStateManagerTools(server: McpServer) {
  server.tool(
    "state_setup_store",
    "Set up a state management store with typed state, actions, and selectors",
    {
      library: z.enum(["redux-toolkit", "zustand", "jotai", "mobx", "pinia", "vuex"]).describe("State management library"),
      name: z.string().describe("Store name"),
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
                action: "setup_state_store",
                instructions: `Set up a ${params.library} store named '${params.name}'${params.typescript !== false ? " with TypeScript" : ""}. Include store configuration, typed root state, dispatch setup, provider/context wrapper, and devtools integration.`,
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
    "state_generate_slices",
    "Generate state slices with reducers, actions, and async thunks",
    {
      library: z.enum(["redux-toolkit", "zustand", "jotai", "mobx", "pinia", "vuex"]).describe("State management library"),
      slices: z.array(
        z.object({
          name: z.string().describe("Slice name"),
          fields: z.array(z.string()).describe("State fields"),
        })
      ).describe("Slices to generate"),
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
                action: "generate_state_slices",
                instructions: `Generate ${params.library} state slices: ${params.slices.map((s) => `'${s.name}' with fields [${s.fields.join(", ")}]`).join("; ")}. Include reducers, action creators, selectors, async thunks for API calls, loading/error states, and unit test stubs.`,
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
    "state_add_persistence",
    "Add state persistence with storage adapters, migration, and rehydration (Pro)",
    {
      library: z.enum(["redux-toolkit", "zustand", "jotai", "mobx", "pinia", "vuex"]).describe("State management library"),
      storage: z.enum(["localStorage", "sessionStorage", "indexedDB", "asyncStorage"]).describe("Storage backend"),
      whitelist: z.array(z.string()).optional().describe("State keys to persist"),
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
                action: "add_state_persistence",
                instructions: `Add persistence to ${params.library} store using ${params.storage}. ${params.whitelist ? `Persist only: ${params.whitelist.join(", ")}.` : ""} Include storage adapter, state migration/versioning, rehydration gate, encryption option, and storage quota handling.`,
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
