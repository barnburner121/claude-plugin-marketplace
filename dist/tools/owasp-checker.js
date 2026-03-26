import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerOwaspCheckerTools(server) {
    server.tool("owasp_scan_top10", "Scan codebase for OWASP Top 10 vulnerabilities", {
        directory: z.string().describe("Project directory to scan"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const owaspChecks = [
            { id: "A01", name: "Broken Access Control", patterns: ["TODO.*auth", "// no auth", "isAdmin.*req\\."] },
            { id: "A02", name: "Cryptographic Failures", patterns: ["md5\\(", "sha1\\(", "DES", "ECB", "http://"] },
            { id: "A03", name: "Injection", patterns: ["\\$\\{.*\\}.*SELECT", "exec\\(.*\\+", "eval\\("] },
            { id: "A04", name: "Insecure Design", patterns: ["rate.?limit", "captcha", "brute.?force"] },
            { id: "A05", name: "Security Misconfiguration", patterns: ["debug.*true", "CORS.*\\*", "helmet"] },
            { id: "A06", name: "Vulnerable Components", patterns: ["package\\.json", "requirements\\.txt"] },
            { id: "A07", name: "Auth Failures", patterns: ["password.*min.*[1-5]\\b", "bcrypt.*rounds.*[1-5]\\b"] },
            { id: "A08", name: "Data Integrity Failures", patterns: ["deserializ", "pickle\\.load", "yaml\\.load"] },
            { id: "A09", name: "Logging Failures", patterns: ["console\\.log.*password", "logger.*secret"] },
            { id: "A10", name: "SSRF", patterns: ["fetch\\(.*req\\.", "axios.*req\\.body", "request\\(.*user"] },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "owasp_scan",
                        directory,
                        checks: owaspChecks,
                        instructions: "For each OWASP Top 10 category, search using the provided patterns to find potential vulnerabilities. Also check for the ABSENCE of protective patterns (e.g., missing rate limiting, missing helmet/CORS config, missing input validation). Report findings grouped by OWASP category with severity, file location, code snippet, and recommended fix.",
                    }, null, 2),
                }],
        };
    });
    server.tool("owasp_fix_vulnerabilities", "Apply fixes for specific OWASP vulnerabilities found in the codebase", {
        directory: z.string().describe("Project directory"),
        category: z.enum(["A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A10"]).describe("OWASP category to fix"),
        api_key: z.string().optional(),
    }, async ({ directory, category, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const fixes = {
            A01: "Add authorization middleware to all routes, implement RBAC, deny by default, validate resource ownership.",
            A02: "Replace weak hashing with bcrypt/argon2, use AES-256-GCM for encryption, enforce HTTPS, remove hardcoded keys.",
            A03: "Parameterize all SQL queries, use ORM safely, validate/sanitize all inputs, escape outputs.",
            A04: "Add rate limiting, implement CAPTCHA on login, add account lockout, use anti-automation controls.",
            A05: "Disable debug mode, configure CORS restrictively, add security headers with helmet, remove default credentials.",
            A06: "Run npm audit/pip audit, update vulnerable dependencies, remove unused packages.",
            A07: "Enforce strong password policy (min 12 chars), use bcrypt with 12+ rounds, implement MFA.",
            A08: "Validate serialized data integrity with HMAC, avoid pickle/yaml.load, verify software update signatures.",
            A09: "Sanitize logs to remove PII/secrets, add structured logging, implement audit trail for auth events.",
            A10: "Validate and whitelist URLs, block requests to internal networks, use allowlists for external services.",
        };
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "fix_owasp_vulnerability",
                        directory,
                        category,
                        fix_strategy: fixes[category],
                        instructions: `Scan the codebase for ${category} vulnerabilities, then apply fixes: ${fixes[category]}. Use the Edit tool to modify affected files. After each fix, verify the change doesn't break functionality.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("owasp_generate_report", "Generate a full OWASP compliance report with scoring (Pro feature)", {
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{
                        type: "text",
                        text: "OWASP compliance reports are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "owasp_compliance_report",
                        directory,
                        instructions: "Run a complete OWASP Top 10 scan and generate a compliance report with: (1) Overall compliance score (0-100), (2) Per-category scores with pass/fail/warning status, (3) Critical findings requiring immediate action, (4) Evidence for each finding (file, line, code), (5) Remediation steps prioritized by risk, (6) Comparison against industry benchmarks. Format as a structured report suitable for security review.",
                    }, null, 2),
                }],
        };
    });
}
