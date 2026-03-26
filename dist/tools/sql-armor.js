import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSqlArmorTools(server) {
    server.tool("sql_detect_injection", "Scan codebase for SQL injection vulnerabilities", {
        directory: z.string().describe("Directory to scan"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const patterns = [
            { name: "String concatenation in SQL", pattern: "(SELECT|INSERT|UPDATE|DELETE).*\\+.*\\$" },
            { name: "Template literal SQL", pattern: "(SELECT|INSERT|UPDATE|DELETE).*\\$\\{" },
            { name: "f-string SQL (Python)", pattern: 'f"(SELECT|INSERT|UPDATE|DELETE)' },
            { name: "format() SQL", pattern: "(SELECT|INSERT|UPDATE|DELETE).*\\.format\\(" },
            { name: "% formatting SQL", pattern: "(SELECT|INSERT|UPDATE|DELETE).*%\\s*\\(" },
            { name: "Raw query with user input", pattern: "(rawQuery|raw|execute|exec)\\(" },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "detect_sql_injection",
                        directory,
                        patterns,
                        instructions: "Search for each pattern in the codebase using Grep. For each match, analyze whether user input flows into the SQL query without parameterization. Flag as Critical if user input (req.body, req.params, request.form, etc.) is directly concatenated. Flag as Warning if the source is unclear. Report each finding with file, line, the vulnerable code, and how to fix it with parameterized queries.",
                    }, null, 2),
                }],
        };
    });
    server.tool("sql_parameterize_queries", "Convert unsafe SQL string concatenation to parameterized queries", {
        file_path: z.string().describe("File containing SQL queries to fix"),
        api_key: z.string().optional(),
    }, async ({ file_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "parameterize_queries",
                        file_path,
                        instructions: "Read the file and find all SQL queries that use string concatenation or template literals with variables. Convert each to use parameterized queries: (1) For Node.js: use $1, $2 placeholders with parameter arrays, (2) For Python: use %s or ? placeholders with tuples, (3) For Go: use $1 placeholders with args, (4) For Java: use PreparedStatement with ? placeholders. Replace each unsafe query using the Edit tool. Preserve the original query logic and ensure all variables are properly mapped to parameters.",
                    }, null, 2),
                }],
        };
    });
    server.tool("sql_audit_report", "Generate a comprehensive SQL security audit report (Pro feature)", {
        directory: z.string().describe("Project directory to audit"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{
                        type: "text",
                        text: "SQL audit reports are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "sql_audit_report",
                        directory,
                        instructions: "Perform a full SQL security audit: (1) Find all SQL injection vulnerabilities, (2) Check for proper input validation before queries, (3) Verify ORM usage is safe (no raw queries with user input), (4) Check for proper error handling that doesn't leak database info, (5) Look for SELECT * usage that may expose sensitive columns, (6) Check for missing LIMIT clauses on user-facing queries, (7) Verify database credentials are not hardcoded. Generate a report with risk scores, affected files, and a prioritized remediation plan.",
                    }, null, 2),
                }],
        };
    });
}
