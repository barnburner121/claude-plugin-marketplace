import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerGdprToolkitTools(server) {
    server.tool("gdpr_scan_pii", "Scan codebase for personally identifiable information (PII) handling and storage", {
        directory: z.string().describe("Project directory to scan"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const piiPatterns = [
            { name: "Email addresses", pattern: "email" },
            { name: "Phone numbers", pattern: "phone|mobile|tel" },
            { name: "Physical addresses", pattern: "address|street|city|zip|postal" },
            { name: "Names", pattern: "first.?name|last.?name|full.?name|surname" },
            { name: "Date of birth", pattern: "birth.?date|dob|date.?of.?birth" },
            { name: "SSN/National ID", pattern: "ssn|social.?security|national.?id|passport" },
            { name: "Financial data", pattern: "credit.?card|bank.?account|iban|routing.?number" },
            { name: "IP addresses", pattern: "ip.?address|client.?ip|remote.?addr" },
            { name: "Cookies/Tracking", pattern: "cookie|tracking.?id|analytics" },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_pii",
                        directory,
                        pii_patterns: piiPatterns,
                        instructions: "Search the codebase for PII field names in models, schemas, database migrations, and API endpoints. For each PII field found, check: (1) Is it encrypted at rest? (2) Is access logged/audited? (3) Is there a retention policy? (4) Can it be exported (data portability)? (5) Can it be deleted (right to erasure)? Report all PII fields found with their storage location and which GDPR requirements are missing.",
                    }, null, 2),
                }],
        };
    });
    server.tool("gdpr_generate_consent", "Generate GDPR-compliant consent management code", {
        language: z.enum(["typescript", "python", "go", "java"]).describe("Target language"),
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ language, directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_consent",
                        language,
                        directory,
                        instructions: `Generate GDPR consent management code in ${language}: (1) Consent model/schema storing purpose, timestamp, version, and withdrawal date, (2) API endpoints to record consent, withdraw consent, and check consent status, (3) Consent middleware that blocks processing without valid consent, (4) Consent versioning so users must re-consent when terms change, (5) Audit log for all consent changes. Consent must be freely given, specific, informed, and unambiguous per GDPR Article 7.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("gdpr_generate_deletion", "Generate right-to-erasure (data deletion) implementation", {
        language: z.enum(["typescript", "python", "go", "java"]).describe("Target language"),
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ language, directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_deletion",
                        language,
                        directory,
                        instructions: `Generate right-to-erasure code in ${language}: (1) Deletion request endpoint that validates user identity, (2) Cascading deletion logic that finds all user PII across tables/collections, (3) Anonymization for data that must be retained (e.g., financial records) - replace PII with hashed/random values, (4) Deletion confirmation notification to the user, (5) 30-day grace period with cancellation option, (6) Audit log entry recording the deletion (without PII). Handle the GDPR exceptions where deletion can be refused (legal obligations, public interest).`,
                    }, null, 2),
                }],
        };
    });
    server.tool("gdpr_compliance_report", "Generate a full GDPR compliance assessment report (Pro feature)", {
        directory: z.string().describe("Project directory to assess"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{
                        type: "text",
                        text: "GDPR compliance reports are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "gdpr_compliance_report",
                        directory,
                        instructions: "Perform a full GDPR compliance assessment: (1) Data inventory - list all PII collected, stored, and processed, (2) Lawful basis check for each data processing activity, (3) Consent management assessment, (4) Data subject rights implementation (access, rectification, erasure, portability), (5) Data protection by design and default, (6) Data breach notification procedures, (7) Cross-border transfer safeguards, (8) DPO designation. Score each area as Compliant, Partially Compliant, or Non-Compliant with specific gaps and remediation steps.",
                    }, null, 2),
                }],
        };
    });
}
