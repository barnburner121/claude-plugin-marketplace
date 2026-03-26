import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDeadCodeTools(server) {
    server.tool("dead_find_unused_exports", "Find exported functions, classes, and constants that are never imported anywhere", {
        directory: z.string().describe("Project directory to scan"),
        file_extensions: z.string().default("ts,tsx,js,jsx").describe("Comma-separated file extensions to scan"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, file_extensions, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "find_unused_exports",
                        directory,
                        file_extensions: file_extensions.split(","),
                        instructions: "Search for all 'export' declarations (export function, export const, export class, export default, export interface, export type) in the codebase. For each exported symbol, search for imports of that symbol across the project. If a symbol is exported but never imported anywhere, flag it as unused. Exclude index files that re-export and entry points (main.ts, index.ts). List each unused export with file path and the exported name.",
                    }, null, 2),
                }],
        };
    });
    server.tool("dead_find_unused_imports", "Find imported modules and symbols that are never used in the file", {
        directory: z.string().describe("Project directory to scan"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "find_unused_imports",
                        directory,
                        instructions: "For each source file, find all import statements. For each imported symbol, check if it is referenced in the rest of the file (excluding comments). Flag imports that are never used. Also check for: (1) Side-effect-only imports that may be intentional (import 'module'), (2) Type-only imports that could use 'import type', (3) Namespace imports where only one member is used. List each unused import with file and the import statement.",
                    }, null, 2),
                }],
        };
    });
    server.tool("dead_find_unused_vars", "Find declared variables, functions, and parameters that are never used", {
        directory: z.string().describe("Project directory to scan"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "find_unused_vars",
                        directory,
                        instructions: "Search for variable and function declarations (const, let, var, function) in each file. For each declaration, check if the name is referenced elsewhere in the same file. Flag declarations that are only assigned but never read. Also check for: (1) Function parameters that are never used (prefix with _ if intentional), (2) Destructured variables that are unused, (3) Variables assigned in loops but never read outside. Exclude exports. List each finding with file, line, and the unused declaration.",
                    }, null, 2),
                }],
        };
    });
    server.tool("dead_cleanup_plan", "Generate a prioritized plan to safely remove dead code (Pro feature)", {
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
                        text: "Dead code cleanup plans are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "dead_code_cleanup",
                        directory,
                        instructions: "Run all three dead code scans (unused exports, imports, vars). Compile results into a prioritized cleanup plan: (1) Group by file, showing total dead code per file, (2) Sort by impact (files with most dead code first), (3) Flag safe removals (unused imports, clearly unused vars) vs. risky removals (exports that might be used dynamically), (4) Estimate total lines that can be removed, (5) Generate the Edit commands to remove each piece of dead code. Provide a step-by-step plan that can be executed without breaking anything.",
                    }, null, 2),
                }],
        };
    });
}
