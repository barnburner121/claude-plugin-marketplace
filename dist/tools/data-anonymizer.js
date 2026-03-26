import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDataAnonymizerTools(server) {
    server.tool("anon_detect_pii", "Detect PII fields in database schemas and data models", {
        schema_source: z.string().describe("Schema definition, model code, or table DDL to scan for PII"),
        regulations: z.array(z.enum(["gdpr", "ccpa", "hipaa", "pci-dss"])).default(["gdpr"]).describe("Compliance regulations to check against"),
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
                        action: "detect_pii",
                        instructions: `Scan the provided schema for PII fields based on ${params.regulations.join(", ")} regulations. Identify fields containing: names, emails, phone numbers, addresses, SSN/national IDs, IP addresses, dates of birth, financial data, health information, and biometric data. Classify each field by sensitivity level (high/medium/low), map to specific regulation requirements, and recommend anonymization strategy per field.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("anon_generate_rules", "Generate anonymization rules with masking, hashing, and synthetic data replacement", {
        fields: z.array(z.string()).describe("PII fields to anonymize (e.g. 'email', 'phone', 'ssn', 'name')"),
        strategy: z.enum(["masking", "hashing", "synthetic", "redaction", "mixed"]).default("mixed").describe("Anonymization strategy"),
        reversible: z.boolean().default(false).describe("Whether anonymization should be reversible (tokenization)"),
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
                        action: "generate_anon_rules",
                        instructions: `Generate ${params.strategy} anonymization rules for fields: ${params.fields.join(", ")}. ${params.reversible ? "Use tokenization with a secure vault for reversible anonymization." : "Use irreversible transformations for maximum privacy."} Apply format-preserving techniques where needed (e.g. valid email format, phone number format), maintain referential integrity across related fields, and ensure statistical distribution is preserved for analytics. Generate TypeScript transformation functions.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("anon_create_script", "Pro: Create a full data anonymization pipeline script for database environments", {
        database: z.enum(["postgresql", "mysql", "mongodb", "sqlite"]).default("postgresql").describe("Database type"),
        orm: z.enum(["prisma", "typeorm", "knex", "raw-sql"]).default("prisma").describe("ORM or raw SQL"),
        environments: z.array(z.enum(["staging", "development", "ci"])).default(["staging", "development"]).describe("Target environments"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The anon_create_script tool requires a Pro subscription. Please upgrade to access anonymization pipeline scripts." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "create_anon_script",
                        instructions: `Create a full data anonymization pipeline for ${params.database} using ${params.orm}, targeting environments: ${params.environments.join(", ")}. Include production-safe guards to prevent accidental execution on prod, batch processing for large tables, progress reporting, pre/post anonymization validation, foreign key handling, and rollback capability. Generate as a CLI script with dry-run mode and table selection options.`,
                    }, null, 2),
                },
            ],
        };
    });
}
