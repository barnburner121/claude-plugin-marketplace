import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerEnvGuardianTools(server) {
    // Tool 1: Scan for exposed secrets in codebase
    server.tool("env_scan_secrets", "Scan files for exposed secrets, API keys, and credentials that should be in .env", {
        directory: z
            .string()
            .describe("Directory to scan for exposed secrets"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        // Secret patterns to detect
        const patterns = [
            { name: "AWS Access Key", regex: "AKIA[0-9A-Z]{16}" },
            { name: "AWS Secret Key", regex: "[0-9a-zA-Z/+]{40}" },
            {
                name: "GitHub Token",
                regex: "gh[pousr]_[A-Za-z0-9_]{36,255}",
            },
            {
                name: "Stripe Key",
                regex: "(sk|pk)_(test|live)_[A-Za-z0-9]{24,}",
            },
            {
                name: "Generic API Key",
                regex: "(api[_-]?key|apikey|api[_-]?secret)\\s*[=:]\\s*['\"][^'\"]{8,}['\"]",
            },
            {
                name: "Database URL",
                regex: "(postgres|mysql|mongodb)(\\+srv)?://[^\\s'\"]{10,}",
            },
            {
                name: "JWT Token",
                regex: "eyJ[A-Za-z0-9-_]+\\.eyJ[A-Za-z0-9-_]+",
            },
            {
                name: "Private Key",
                regex: "-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----",
            },
        ];
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_secrets",
                        directory,
                        patterns: patterns.map((p) => ({
                            name: p.name,
                            pattern: p.regex,
                        })),
                        instructions: "Use Grep tool to search for each pattern in the directory. Report any matches found with file path, line number, and which pattern matched. Suggest moving each to .env and adding to .gitignore.",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: Generate .env template from codebase
    server.tool("env_generate_template", "Analyze codebase and generate a .env.example template with all required environment variables", {
        directory: z.string().describe("Project root directory"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const searchPatterns = [
            "process\\.env\\.[A-Z_]+",
            "os\\.environ\\.get\\(['\"][A-Z_]+",
            "env\\(['\"][A-Z_]+",
            "getenv\\(['\"][A-Z_]+",
            "Env\\.get\\(['\"][A-Z_]+",
        ];
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_env_template",
                        directory,
                        search_patterns: searchPatterns,
                        instructions: "Search for each pattern to find all environment variables referenced in the codebase. Group them by category (database, API keys, app config, etc.). Generate a .env.example file with descriptive comments, placeholder values, and required/optional markers.",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: Validate .env against .env.example
    server.tool("env_validate", "Check that .env contains all required variables from .env.example and flag any mismatches", {
        env_path: z.string().default(".env").describe("Path to .env file"),
        example_path: z
            .string()
            .default(".env.example")
            .describe("Path to .env.example"),
        api_key: z.string().optional(),
    }, async ({ env_path, example_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "validate_env",
                        env_path,
                        example_path,
                        instructions: "Read both files. Compare variable names. Report: (1) Variables in .env.example but missing from .env, (2) Variables in .env but not in .env.example (potentially unused), (3) Variables with empty values that look required. Output a validation report.",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 4: Rotate/regenerate secrets
    server.tool("env_rotate_secrets", "Generate new random values for secrets in .env file (Pro feature)", {
        env_path: z.string().default(".env"),
        variables: z
            .array(z.string())
            .describe("List of variable names to rotate"),
        length: z.number().default(32).describe("Length of generated secrets"),
        api_key: z.string().optional(),
    }, async ({ env_path, variables, length, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: "Secret rotation is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    },
                ],
            };
        }
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        const newSecrets = {};
        for (const v of variables) {
            let secret = "";
            for (let i = 0; i < length; i++) {
                secret += charset[Math.floor(Math.random() * charset.length)];
            }
            newSecrets[v] = secret;
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "rotate_secrets",
                        env_path,
                        new_values: newSecrets,
                        instructions: `Update these variables in ${env_path} with the new generated values. Back up the old .env first.`,
                    }, null, 2),
                },
            ],
        };
    });
}
