import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCodeSmellsTools(server) {
    server.tool("smell_detect_long_methods", "Find methods and functions that are too long and should be broken down", {
        directory: z.string().describe("Project directory to scan"),
        max_lines: z.number().default(30).describe("Maximum lines before flagging a function"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ directory, max_lines, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "detect_long_methods",
                        directory,
                        max_lines,
                        instructions: `Search for function/method declarations in the codebase. For each function, count the lines of code (excluding blank lines and comments). Flag any function exceeding ${max_lines} lines. For each flagged function, report: (1) File path and function name, (2) Line count, (3) Identify logical sections within the function that could be extracted into separate functions, (4) Suggest specific extraction points with proposed function names. Sort by length descending.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("smell_detect_god_classes", "Find classes with too many responsibilities that violate the Single Responsibility Principle", {
        directory: z.string().describe("Project directory to scan"),
        max_methods: z.number().default(10).describe("Maximum methods before flagging a class"),
        api_key: z.string().optional(),
    }, async ({ directory, max_methods, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "detect_god_classes",
                        directory,
                        max_methods,
                        instructions: `Find all class declarations in the codebase. For each class, count the number of methods and properties. Flag classes with more than ${max_methods} methods as potential God Classes. Also check for: (1) Classes with many unrelated methods (different domains), (2) Classes with too many dependencies/imports, (3) Classes over 300 lines total. For each flagged class, suggest how to split it into smaller classes with single responsibilities.`,
                    }, null, 2),
                }],
        };
    });
    server.tool("smell_detect_feature_envy", "Find methods that use more data from other classes than their own", {
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
                        action: "detect_feature_envy",
                        directory,
                        instructions: "Find methods that heavily access another object's data. Look for patterns: (1) Methods with many dot-access chains on the same object (obj.a, obj.b, obj.c), (2) Methods that take an object parameter and access multiple properties, (3) Utility methods that operate entirely on another class's data. For each case, suggest moving the method to the class whose data it primarily uses, or extracting the data access into a method on that class.",
                    }, null, 2),
                }],
        };
    });
    server.tool("smell_refactor_plan", "Generate a comprehensive refactoring plan for all detected code smells (Pro feature)", {
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
                        text: "Refactoring plans are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "refactor_plan",
                        directory,
                        instructions: "Run all code smell detectors and compile a prioritized refactoring plan: (1) List all smells found grouped by type, (2) Score each by impact (how much it affects maintainability), (3) Estimate effort for each refactoring (small/medium/large), (4) Identify dependencies between refactorings (order matters), (5) Suggest specific refactoring patterns to apply (Extract Method, Extract Class, Move Method, etc.), (6) Provide before/after code examples for the top 5 highest-impact refactorings.",
                    }, null, 2),
                }],
        };
    });
}
