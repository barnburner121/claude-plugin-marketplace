import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDynamodbDesignerTools(server) {
    server.tool("ddb_design_table", "Design a DynamoDB table schema with partition key, sort key, and capacity settings", {
        table_name: z.string().describe("DynamoDB table name"),
        partition_key: z.string().describe("Partition key attribute name"),
        sort_key: z.string().optional().describe("Sort key attribute name"),
        billing_mode: z.enum(["PAY_PER_REQUEST", "PROVISIONED"]).describe("Billing mode"),
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
                        action: "design_dynamodb_table",
                        instructions: `Design a DynamoDB table '${params.table_name}' with partition key '${params.partition_key}'${params.sort_key ? ` and sort key '${params.sort_key}'` : ""} using ${params.billing_mode} billing. Include attribute definitions, key schema, CloudFormation/CDK template, and single-table design recommendations.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("ddb_generate_gsi", "Generate Global Secondary Index configurations for alternate query patterns", {
        table_name: z.string().describe("DynamoDB table name"),
        index_name: z.string().describe("GSI name"),
        partition_key: z.string().describe("GSI partition key attribute"),
        sort_key: z.string().optional().describe("GSI sort key attribute"),
        projection: z.enum(["ALL", "KEYS_ONLY", "INCLUDE"]).describe("Projection type"),
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
                        action: "generate_dynamodb_gsi",
                        instructions: `Generate a GSI '${params.index_name}' on table '${params.table_name}' with partition key '${params.partition_key}'${params.sort_key ? ` and sort key '${params.sort_key}'` : ""}. Use ${params.projection} projection. Include capacity planning, query examples, and cost implications.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("ddb_optimize_queries", "Analyze and optimize DynamoDB query patterns for performance and cost (Pro)", {
        table_name: z.string().describe("DynamoDB table name"),
        access_patterns: z.array(z.string()).describe("List of access patterns to optimize"),
        current_rcu: z.number().optional().describe("Current read capacity units consumed"),
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
                        action: "optimize_dynamodb_queries",
                        instructions: `Optimize query patterns for DynamoDB table '${params.table_name}'. Access patterns: ${params.access_patterns.join("; ")}. ${params.current_rcu ? `Current RCU: ${params.current_rcu}.` : ""} Recommend GSI changes, query vs scan optimizations, projection expressions, and batch operation strategies.`,
                    }, null, 2),
                },
            ],
        };
    });
}
