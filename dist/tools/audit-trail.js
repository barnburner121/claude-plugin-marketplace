import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerAuditTrailTools(server) {
    server.tool("audit_generate_schema", "Generate audit trail database schema with event storage, user tracking, and change diffs", {
        database: z.enum(["postgresql", "mysql", "mongodb", "sqlite"]).default("postgresql").describe("Database type"),
        tables_to_audit: z.array(z.string()).describe("Tables/collections to track changes on"),
        include_diff: z.boolean().default(true).describe("Whether to store before/after change diffs"),
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
                        action: "generate_audit_schema",
                        instructions: `Generate an audit trail schema for ${params.database} tracking changes on tables: ${params.tables_to_audit.join(", ")}. Include fields for: event type (create/update/delete), actor (user ID, IP, user agent), timestamp, resource type and ID, ${params.include_diff ? "before/after snapshots with JSON diff," : ""} and correlation ID for request tracing. Add proper indexes for querying by resource, actor, time range, and event type. Include partitioning strategy for high-volume audit logs.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("audit_add_triggers", "Add automatic audit logging via database triggers or ORM middleware", {
        approach: z.enum(["database-triggers", "orm-middleware", "application-events"]).default("orm-middleware").describe("Audit capture approach"),
        orm: z.enum(["prisma", "typeorm", "knex", "sequelize", "raw-sql"]).default("prisma").describe("ORM in use"),
        tables: z.array(z.string()).describe("Tables to add audit triggers for"),
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
                        action: "add_audit_triggers",
                        instructions: `Add automatic audit logging using ${params.approach} with ${params.orm} for tables: ${params.tables.join(", ")}. ${params.approach === "database-triggers" ? "Create INSERT/UPDATE/DELETE triggers that write to the audit table." : params.approach === "orm-middleware" ? "Create ORM middleware/hooks that capture changes before and after operations." : "Create application-level event emitters that log to the audit system."} Capture the acting user from request context, compute field-level diffs, handle bulk operations, and ensure audit writes don't block the main transaction on failure.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("audit_query_builder", "Pro: Build audit trail query API with filtering, timeline views, and compliance reports", {
        features: z.array(z.enum(["timeline", "diff-view", "export", "compliance-report", "search"])).describe("Query features to implement"),
        framework: z.enum(["express", "fastify", "nestjs"]).default("express").describe("Server framework"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The audit_query_builder tool requires a Pro subscription. Please upgrade to access audit query building." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "build_audit_queries",
                        instructions: `Build an audit trail query API using ${params.framework} with features: ${params.features.join(", ")}. Implement paginated listing with cursor-based pagination, filtering by actor/resource/time range/event type, ${params.features.includes("timeline") ? "chronological timeline view for a specific resource," : ""} ${params.features.includes("diff-view") ? "side-by-side diff rendering," : ""} ${params.features.includes("export") ? "CSV/JSON export for compliance," : ""} ${params.features.includes("compliance-report") ? "automated compliance reports with access summaries," : ""} and role-based access control for audit data. Optimize queries with proper indexing.`,
                    }, null, 2),
                },
            ],
        };
    });
}
