import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRbacForgeTools(server) {
    server.tool("rbac_generate_roles", "Generate role and permission definitions with hierarchical role inheritance", {
        roles: z.array(z.string()).describe("List of role names (e.g., admin, editor, viewer)"),
        resources: z.array(z.string()).describe("List of resources to protect (e.g., users, posts, settings)"),
        language: z.enum(["typescript", "python", "go", "java"]).describe("Target language"),
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ roles, resources, language, directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_roles",
                        roles,
                        resources,
                        language,
                        directory,
                        instructions: `Generate RBAC role definitions in ${language} with: (1) Role enum/constants for: ${roles.join(", ")}, (2) Permission enum with CRUD operations for each resource: ${resources.join(", ")}, (3) Role-permission mapping with hierarchy (higher roles inherit lower role permissions), (4) Helper functions: hasPermission(user, permission), hasRole(user, role), getUserPermissions(user), (5) Database schema/migration for roles and permissions tables. Write files to the directory.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("rbac_generate_middleware", "Generate authorization middleware that enforces role-based access control", {
        framework: z.enum(["express", "fastify", "django", "flask", "gin", "spring"]).describe("Web framework"),
        directory: z.string().describe("Project directory"),
        api_key: z.string().optional(),
    }, async ({ framework, directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_rbac_middleware",
                        framework,
                        directory,
                        instructions: `Generate RBAC middleware for ${framework} with: (1) requireRole(role) middleware that checks user has the specified role, (2) requirePermission(resource, action) middleware for fine-grained access control, (3) requireOwnership(resource) middleware that checks user owns the resource, (4) Proper 403 Forbidden responses with descriptive error messages, (5) Decorator/annotation pattern if the framework supports it. Include example route/endpoint usage showing how to protect routes.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("rbac_audit_permissions", "Audit existing codebase for permission gaps and over-privileged access (Pro feature)", {
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
                        text: "Permission auditing is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "audit_permissions",
                        directory,
                        instructions: "Scan the codebase for authorization issues: (1) Find all route/endpoint definitions and check which have no auth middleware, (2) Find admin-only operations accessible without role checks, (3) Look for direct database queries that bypass permission checks, (4) Check for horizontal privilege escalation (user can access other users' resources without ownership check), (5) Find hardcoded role checks (string comparisons instead of using the RBAC system). Generate a report listing unprotected endpoints and missing permission checks with recommended fixes.",
                    }, null, 2),
                }],
        };
    });
}
