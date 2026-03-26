import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerDataGenTools(server: McpServer) {
  server.tool(
    "data_generate_from_schema",
    "Generate sample data from a JSON schema, TypeScript interface, or database schema",
    {
      schema: z.string().describe("JSON schema, TypeScript interface, or SQL table definition"),
      count: z.number().optional().describe("Number of records to generate"),
      format: z.string().optional().describe("Output format: 'json', 'csv', or 'sql'"),
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
                action: "generate_data_from_schema",
                instructions:
                  "Parse the provided schema definition and generate sample data that conforms to all constraints (types, required fields, enums, min/max values, patterns). Generate the requested number of records with varied but valid values. Output in the specified format with proper structure and formatting.",
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
    "data_generate_realistic",
    "Generate realistic fake data with contextually appropriate values (names, emails, addresses, etc.)",
    {
      data_description: z.string().describe("Description of the data to generate, including field names and types"),
      count: z.number().optional().describe("Number of records to generate"),
      locale: z.string().optional().describe("Locale for generating region-specific data (e.g., 'en-US', 'de-DE')"),
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
                action: "generate_realistic_data",
                instructions:
                  "Generate realistic fake data based on the provided description. Use contextually appropriate values: real-looking names, valid email formats, properly formatted phone numbers, realistic addresses for the specified locale, plausible dates, and consistent relationships between fields (e.g., city matches state/country). Ensure data looks production-like for testing and demos.",
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
    "data_generate_edge_cases",
    "Generate edge case and boundary test data for stress testing (Pro)",
    {
      schema: z.string().describe("Schema or data description to generate edge cases for"),
      categories: z.array(z.string()).optional().describe("Edge case categories: 'unicode', 'overflow', 'injection', 'empty', 'special_chars'"),
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
                  instructions:
                    "This tool requires a Pro subscription. Upgrade to Pro to generate edge case test data including unicode, overflow, injection, and boundary value scenarios.",
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
                action: "generate_edge_case_data",
                instructions:
                  "Generate comprehensive edge case test data for each field in the schema. Include: unicode strings (emoji, RTL text, zero-width characters), boundary values (MAX_INT, empty strings, null), SQL/XSS injection strings, extremely long values, special characters, negative numbers, dates at epoch boundaries, and malformed data. Label each record with the edge case category it tests.",
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
