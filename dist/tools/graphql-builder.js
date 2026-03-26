import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerGraphqlBuilderTools(server) {
    server.tool("graphql_generate_schema", "Generate GraphQL type definitions and schema from data models", {
        models: z.array(z.string()).describe("List of model names to generate types for (e.g. 'User', 'Post')"),
        relationships: z.array(z.string()).optional().describe("Relationships between models (e.g. 'User hasMany Post')"),
        include_inputs: z.boolean().default(true).describe("Whether to generate input types for mutations"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_graphql_schema",
                        instructions: `Generate GraphQL SDL type definitions for models: ${params.models.join(", ")}. ${params.relationships ? `Define relationships: ${params.relationships.join(", ")}.` : ""} ${params.include_inputs ? "Generate corresponding Input types for create and update mutations." : ""} Include Query and Mutation root types, use proper scalar types, add descriptions, and follow relay-style connection patterns for lists.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("graphql_generate_resolvers", "Generate resolver functions for GraphQL schema types and fields", {
        type_name: z.string().describe("The GraphQL type to generate resolvers for"),
        operations: z.array(z.enum(["query", "mutation", "subscription", "field"])).describe("Which resolver types to generate"),
        datasource: z.enum(["prisma", "typeorm", "mongoose", "knex", "custom"]).default("prisma").describe("Data source ORM/library"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_graphql_resolvers",
                        instructions: `Generate GraphQL resolvers for the '${params.type_name}' type using ${params.datasource} as the data source. Include resolver functions for: ${params.operations.join(", ")}. Add proper authentication context checks, input validation, error handling with GraphQL-friendly error extensions, and DataLoader patterns for N+1 query prevention on field resolvers.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("graphql_optimize_queries", "Pro: Analyze and optimize GraphQL queries for performance, detect N+1 issues", {
        schema: z.string().describe("GraphQL schema SDL or summary"),
        query: z.string().describe("The GraphQL query to optimize"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier !== "pro") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The graphql_optimize_queries tool requires a Pro subscription. Please upgrade to access GraphQL query optimization." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "optimize_graphql_queries",
                        instructions: `Analyze the provided GraphQL query against the schema for performance issues. Detect N+1 query patterns, excessive depth, unbounded lists without pagination, missing DataLoader opportunities, and over-fetching. Suggest query complexity limits, persisted queries, field-level cost analysis, and batching strategies. Provide an optimized version of the query and resolver recommendations.`,
                    }, null, 2),
                },
            ],
        };
    });
}
