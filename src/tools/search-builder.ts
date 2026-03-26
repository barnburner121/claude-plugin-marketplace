import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerSearchBuilderTools(server: McpServer) {
  server.tool(
    "search_setup_engine",
    "Set up a search engine integration with Elasticsearch, Meilisearch, or Typesense",
    {
      engine: z.enum(["elasticsearch", "meilisearch", "typesense"]).default("meilisearch").describe("Search engine to integrate"),
      collections: z.array(z.string()).describe("Collections/indices to create (e.g. 'products', 'articles')"),
      include_sync: z.boolean().default(true).describe("Whether to include database-to-search sync"),
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
                action: "setup_search_engine",
                instructions: `Set up ${params.engine} integration with collections: ${params.collections.join(", ")}. Configure client connection, create indices with appropriate mappings/settings, and set up searchable/filterable/sortable attributes. ${params.include_sync ? "Implement database-to-search sync using change events or polling." : ""} Add health checks, connection retry logic, and index management utilities.`,
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
    "search_generate_index",
    "Generate index configurations with field mappings, analyzers, and tokenizers",
    {
      index_name: z.string().describe("Name of the search index"),
      fields: z.array(z.string()).describe("Fields to index (e.g. 'title:text', 'price:number', 'tags:keyword')"),
      language: z.string().default("english").describe("Primary language for text analysis"),
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
                action: "generate_search_index",
                instructions: `Generate search index configuration for '${params.index_name}' with fields: ${params.fields.join(", ")}. Set up ${params.language} language analyzers, custom tokenizers for special fields, synonym support, and stop word filtering. Configure field-level boosting, multi-field mappings for text fields (keyword + analyzed), and proper numeric/date field types.`,
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
    "search_optimize_queries",
    "Pro: Optimize search queries with relevance tuning, faceting, and performance analysis",
    {
      index_name: z.string().describe("Index to optimize queries for"),
      query_patterns: z.array(z.string()).describe("Common query patterns to optimize (e.g. 'full-text', 'autocomplete', 'geo-search')"),
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
              text: JSON.stringify(
                { action: "upgrade_required", instructions: "The search_optimize_queries tool requires a Pro subscription. Please upgrade to access search query optimization." },
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
                action: "optimize_search_queries",
                instructions: `Optimize search queries for the '${params.index_name}' index targeting patterns: ${params.query_patterns.join(", ")}. Tune relevance scoring with field boosting and function scores, add faceted search configuration, implement query suggestions and did-you-mean, configure result highlighting, and add search analytics tracking. Profile query performance and recommend index optimizations.`,
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
