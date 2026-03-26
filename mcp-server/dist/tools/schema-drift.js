import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSchemaDriftTools(server) {
    // Tool 1: Generate database migration from schema changes
    server.tool("schema_generate_migration", "Compare current schema with desired state and generate a migration file", {
        current_schema: z
            .string()
            .describe("Path to current schema file or migration directory"),
        desired_changes: z
            .string()
            .describe("Description of desired schema changes (e.g., 'add email_verified boolean to users table')"),
        db_type: z
            .enum(["postgres", "mysql", "sqlite", "mongodb"])
            .default("postgres"),
        orm: z
            .enum(["prisma", "drizzle", "knex", "typeorm", "sequelize", "raw-sql"])
            .default("raw-sql")
            .describe("ORM or migration tool in use"),
        api_key: z.string().optional(),
    }, async ({ current_schema, desired_changes, db_type, orm, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_migration",
                        current_schema,
                        desired_changes,
                        db_type,
                        orm,
                        instructions: `Read the current schema at ${current_schema}. Generate a ${orm} migration for ${db_type} that: (1) Implements: ${desired_changes}, (2) Includes both UP and DOWN migrations, (3) Handles data migration if needed (not just schema), (4) Is safe for zero-downtime deployment (no locking large tables), (5) Includes appropriate indexes for new columns, (6) Adds comments explaining the change. Name the migration file with timestamp prefix.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: Detect schema drift between code and database
    server.tool("schema_detect_drift", "Compare your ORM models/schema definitions against the actual migration state", {
        models_path: z
            .string()
            .describe("Path to model/schema definitions"),
        migrations_path: z
            .string()
            .describe("Path to migration files directory"),
        api_key: z.string().optional(),
    }, async ({ models_path, migrations_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "detect_drift",
                        models_path,
                        migrations_path,
                        instructions: `Read model definitions at ${models_path} and all migration files at ${migrations_path}. Compare: (1) Tables/collections defined in models but missing from migrations, (2) Columns defined in models but not created by any migration, (3) Columns in migrations that don't exist in models (orphaned), (4) Type mismatches between models and migrations, (5) Index definitions that don't match, (6) Missing foreign key constraints. Output a drift report with specific discrepancies.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: Safe migration validator
    server.tool("schema_validate_migration", "Check a migration file for common safety issues before running it (Pro feature)", {
        migration_path: z.string().describe("Path to migration file"),
        db_type: z
            .enum(["postgres", "mysql", "sqlite"])
            .default("postgres"),
        table_row_estimates: z
            .record(z.number())
            .optional()
            .describe("Estimated row counts for tables (e.g., {users: 1000000})"),
        api_key: z.string().optional(),
    }, async ({ migration_path, db_type, table_row_estimates, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: "Migration validation is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "validate_migration",
                        migration_path,
                        db_type,
                        table_row_estimates,
                        instructions: `Read the migration at ${migration_path}. Check for ${db_type}-specific safety issues: (1) ALTER TABLE on large tables without CONCURRENTLY (Postgres) or ALGORITHM=INPLACE (MySQL), (2) Adding NOT NULL columns without defaults on existing tables, (3) Dropping columns that might be referenced by application code, (4) Creating indexes without CONCURRENTLY on large tables, (5) Data migrations mixed with schema migrations, (6) Missing transaction boundaries, (7) Estimated lock duration based on table sizes: ${JSON.stringify(table_row_estimates)}. Rate each issue as safe/warning/dangerous.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 4: Schema documentation generator
    server.tool("schema_generate_docs", "Generate comprehensive database schema documentation from your models", {
        models_path: z.string().describe("Path to model/schema definitions"),
        output_format: z
            .enum(["markdown", "dbml", "mermaid"])
            .default("markdown"),
        api_key: z.string().optional(),
    }, async ({ models_path, output_format, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_schema_docs",
                        models_path,
                        output_format,
                        instructions: `Read all model/schema files at ${models_path}. Generate ${output_format} documentation including: (1) Entity-relationship diagram, (2) Table/collection descriptions with column details, (3) Data types and constraints, (4) Foreign key relationships, (5) Indexes and their purposes, (6) Enum/type definitions, (7) Example queries for common operations. Output as a single ${output_format} document.`,
                    }, null, 2),
                },
            ],
        };
    });
}
