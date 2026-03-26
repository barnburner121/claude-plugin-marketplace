import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerQueryOptimizerTools(server: McpServer) {
  server.tool(
    "query_analyze_slow",
    "Analyze slow database queries and identify performance bottlenecks",
    {
      query: z.string().describe("The SQL query to analyze"),
      database: z.enum(["postgresql", "mysql", "sqlite", "mssql"]).default("postgresql").describe("Database engine"),
      table_info: z.string().optional().describe("Table schema info including existing indexes"),
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
                action: "analyze_slow_query",
                instructions: `Analyze the provided SQL query for ${params.database} performance issues. ${params.table_info ? `Table schema context: ${params.table_info}.` : ""} Examine the query for full table scans, missing index usage, inefficient JOINs, subquery anti-patterns, unnecessary sorting, and lock contention risks. Provide EXPLAIN plan interpretation guidance and identify the root cause of slowness.`,
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
    "query_suggest_indexes",
    "Suggest database indexes based on query patterns and table structure",
    {
      queries: z.array(z.string()).describe("Common queries to optimize with indexes"),
      table_name: z.string().describe("Target table name"),
      existing_indexes: z.array(z.string()).optional().describe("Already existing indexes"),
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
                action: "suggest_indexes",
                instructions: `Analyze the provided queries against table '${params.table_name}' and suggest optimal indexes. ${params.existing_indexes ? `Existing indexes: ${params.existing_indexes.join(", ")}.` : ""} Recommend composite indexes with proper column ordering, partial indexes for filtered queries, covering indexes to avoid table lookups, and expression indexes where beneficial. Warn about over-indexing and write performance impact. Provide CREATE INDEX statements.`,
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
    "query_rewrite",
    "Pro: Rewrite SQL queries for optimal performance while preserving correctness",
    {
      query: z.string().describe("The SQL query to rewrite"),
      database: z.enum(["postgresql", "mysql", "sqlite", "mssql"]).default("postgresql").describe("Database engine"),
      optimization_goal: z.enum(["speed", "memory", "balanced"]).default("balanced").describe("Primary optimization goal"),
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
                { action: "upgrade_required", instructions: "The query_rewrite tool requires a Pro subscription. Please upgrade to access query rewriting." },
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
                action: "rewrite_query",
                instructions: `Rewrite the provided ${params.database} query optimized for ${params.optimization_goal}. Apply transformations: convert correlated subqueries to JOINs, use CTEs for readability and materialization hints, replace IN with EXISTS where appropriate, add proper predicate pushdown, optimize GROUP BY and window functions, and use database-specific features. Verify semantic equivalence and explain each transformation.`,
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
