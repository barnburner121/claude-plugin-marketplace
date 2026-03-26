import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPaginationGenTools(server) {
    server.tool("page_generate_cursor", "Generate cursor-based pagination with opaque cursors and relay-style connections", {
        framework: z.enum(["express", "fastify", "nestjs", "graphql", "prisma"]).describe("Framework or ORM"),
        entity: z.string().describe("Entity/model name to paginate"),
        default_page_size: z.number().optional().describe("Default page size"),
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
                        action: "generate_cursor_pagination",
                        instructions: `Generate cursor-based pagination for '${params.entity}' using ${params.framework}. Default page size: ${params.default_page_size || 20}. Include opaque cursor encoding/decoding, hasNextPage/hasPreviousPage flags, total count, Relay-style connection/edge types, and forward/backward navigation.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("page_generate_offset", "Generate offset-based pagination with page numbers, total counts, and metadata", {
        framework: z.enum(["express", "fastify", "nestjs", "graphql", "prisma"]).describe("Framework or ORM"),
        entity: z.string().describe("Entity/model name to paginate"),
        default_page_size: z.number().optional().describe("Default page size"),
        max_page_size: z.number().optional().describe("Maximum allowed page size"),
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
                        action: "generate_offset_pagination",
                        instructions: `Generate offset-based pagination for '${params.entity}' using ${params.framework}. Default page size: ${params.default_page_size || 20}, max page size: ${params.max_page_size || 100}. Include page/limit query parameters, total count, total pages, current page metadata, and Link header generation.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("page_generate_keyset", "Generate keyset pagination for high-performance ordered datasets with seek method (Pro)", {
        framework: z.enum(["express", "fastify", "nestjs", "graphql", "prisma"]).describe("Framework or ORM"),
        entity: z.string().describe("Entity/model name to paginate"),
        sort_columns: z.array(z.string()).describe("Columns used for keyset ordering"),
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
                        text: JSON.stringify({ error: "This tool requires a Pro subscription." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_keyset_pagination",
                        instructions: `Generate keyset (seek) pagination for '${params.entity}' using ${params.framework}. Sort by columns: ${params.sort_columns.join(", ")}. Include composite key comparison, index-friendly queries, deterministic ordering with tiebreaker, bi-directional navigation, and performance comparison with offset pagination.`,
                    }, null, 2),
                },
            ],
        };
    });
}
