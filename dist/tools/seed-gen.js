import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSeedGenTools(server) {
    server.tool("seed_generate_data", "Generate realistic seed data with faker.js for database tables", {
        table_name: z.string().describe("Table name to generate seed data for"),
        fields: z.array(z.string()).describe("Fields with types (e.g. 'name:person.fullName', 'email:internet.email', 'age:number.int')"),
        count: z.number().default(50).describe("Number of seed records to generate"),
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
                        action: "generate_seed_data",
                        instructions: `Generate ${params.count} realistic seed records for the '${params.table_name}' table using @faker-js/faker. Map fields: ${params.fields.join(", ")}. Ensure referential integrity if foreign keys are present, use deterministic seeding for reproducibility, handle unique constraints with retry logic, and generate data in batches for memory efficiency. Output as a runnable TypeScript seed script.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("seed_from_schema", "Auto-generate seed scripts by introspecting database schema or ORM models", {
        orm: z.enum(["prisma", "typeorm", "drizzle", "knex", "sequelize"]).describe("ORM to introspect schema from"),
        schema_path: z.string().optional().describe("Path to schema file (e.g. 'prisma/schema.prisma')"),
        tables: z.array(z.string()).optional().describe("Specific tables to seed (defaults to all)"),
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
                        action: "seed_from_schema",
                        instructions: `Generate seed scripts by introspecting the ${params.orm} schema${params.schema_path ? ` at '${params.schema_path}'` : ""}. ${params.tables ? `Seed specific tables: ${params.tables.join(", ")}.` : "Seed all tables."} Automatically detect field types and map to appropriate faker generators, respect required/optional fields, handle relationships with proper insertion order (topological sort), and generate realistic relational data.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("seed_reset_script", "Pro: Generate database reset and re-seed scripts with environment safety checks", {
        orm: z.enum(["prisma", "typeorm", "drizzle", "knex", "sequelize"]).describe("ORM in use"),
        environments: z.array(z.enum(["development", "test", "staging"])).default(["development", "test"]).describe("Environments where reset is allowed"),
        include_migrations: z.boolean().default(true).describe("Whether to re-run migrations before seeding"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The seed_reset_script tool requires a Pro subscription. Please upgrade to access database reset script generation." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_reset_script",
                        instructions: `Generate a database reset and re-seed script using ${params.orm}. CRITICAL: Add environment safety checks that ONLY allow execution in: ${params.environments.join(", ")}. Block production execution with multiple safeguards. ${params.include_migrations ? "Drop and re-run all migrations before seeding." : ""} Truncate tables in correct foreign key order, re-seed with fresh data, verify data integrity after seeding, and add a dry-run mode.`,
                    }, null, 2),
                },
            ],
        };
    });
}
