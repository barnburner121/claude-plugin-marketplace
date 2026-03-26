import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerAuthArchitectTools(server) {
    server.tool("auth_generate_jwt", "Generate JWT authentication boilerplate with signing, verification, and refresh token logic", {
        language: z.enum(["typescript", "python", "go", "java"]).describe("Target language"),
        directory: z.string().describe("Project directory to generate files in"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ language, directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_jwt_auth",
                        language,
                        directory,
                        instructions: `Generate JWT authentication code in ${language} with: (1) Token signing function using RS256 or HS256 with configurable secret from env vars, (2) Token verification middleware that checks expiry and signature, (3) Refresh token rotation logic with token family tracking to detect reuse, (4) Token blacklist/revocation support, (5) Proper error responses for expired/invalid tokens. Include constants for token expiry (15min access, 7d refresh). Write files to the directory.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("auth_generate_oauth", "Generate OAuth 2.0 / OpenID Connect integration boilerplate", {
        provider: z.enum(["google", "github", "apple", "generic"]).describe("OAuth provider"),
        language: z.enum(["typescript", "python", "go", "java"]).describe("Target language"),
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ provider, language, directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_oauth",
                        provider,
                        language,
                        directory,
                        instructions: `Generate OAuth 2.0 integration for ${provider} in ${language} with: (1) Authorization URL builder with PKCE support and state parameter for CSRF protection, (2) Callback handler that exchanges code for tokens, (3) Token storage and refresh logic, (4) User profile fetching from the provider, (5) Account linking for users with existing accounts. Use env vars for client ID/secret. Write files to the directory.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("auth_generate_session", "Generate secure session-based authentication with cookie management", {
        language: z.enum(["typescript", "python", "go", "java"]).describe("Target language"),
        directory: z.string().describe("Project directory"),
        store: z.enum(["redis", "database", "memory"]).default("redis").describe("Session store type"),
        api_key: z.string().optional(),
    }, async ({ language, directory, store, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_session_auth",
                        language,
                        directory,
                        store,
                        instructions: `Generate session-based auth in ${language} using ${store} as session store: (1) Session creation on login with secure random session IDs, (2) Cookie configuration with HttpOnly, Secure, SameSite=Strict, proper Max-Age, (3) Session validation middleware, (4) Session destroy on logout with cookie clearing, (5) Session expiry and cleanup, (6) CSRF token generation and validation. Write files to the directory.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("auth_audit_security", "Audit existing authentication implementation for vulnerabilities (Pro feature)", {
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
                        text: "Auth security auditing is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        const patterns = [
            { name: "Weak hashing", pattern: "(md5|sha1)\\(" },
            { name: "No password hashing", pattern: "password\\s*===?\\s*" },
            { name: "Hardcoded secrets", pattern: "(secret|key)\\s*=\\s*['\"][^'\"]{8,}['\"]" },
            { name: "Missing rate limiting", pattern: "(login|signin|authenticate)" },
            { name: "SQL injection in auth", pattern: "(SELECT|INSERT).*\\$\\{.*password" },
            { name: "No CSRF protection", pattern: "(POST|PUT|DELETE).*csrf" },
        ];
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "audit_auth_security",
                        directory,
                        patterns,
                        instructions: "Search the codebase for auth-related files and check for: (1) Weak password hashing (md5, sha1 instead of bcrypt/argon2), (2) Plain-text password comparison, (3) Hardcoded secrets/keys, (4) Missing rate limiting on login endpoints, (5) SQL injection in auth queries, (6) Missing CSRF protection on state-changing endpoints, (7) Insecure cookie settings, (8) Missing account lockout. Generate a security audit report with severity ratings and fixes.",
                    }, null, 2),
                }],
        };
    });
}
