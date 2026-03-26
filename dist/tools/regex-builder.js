import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRegexBuilderTools(server) {
    server.tool("regex_build_pattern", "Build a regular expression pattern from a natural language description", {
        description: z.string().describe("Natural language description of what the regex should match"),
        flavor: z.enum(["javascript", "python", "pcre", "posix"]).describe("Regex flavor/engine"),
        flags: z.array(z.enum(["global", "case-insensitive", "multiline", "dotall"])).optional().describe("Regex flags to apply"),
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
                        action: "build_regex_pattern",
                        instructions: `Build a ${params.flavor} regex pattern that matches: ${params.description}. ${params.flags ? `Apply flags: ${params.flags.join(", ")}.` : ""} Include the pattern, named capture groups where appropriate, and example matches/non-matches.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("regex_explain", "Explain a regular expression pattern in plain language with a breakdown of each component", {
        pattern: z.string().describe("The regex pattern to explain"),
        flavor: z.enum(["javascript", "python", "pcre", "posix"]).optional().describe("Regex flavor for context"),
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
                        action: "explain_regex",
                        instructions: `Explain the regex pattern '${params.pattern}'${params.flavor ? ` in ${params.flavor} flavor` : ""}. Break down each component, describe what it matches, identify capture groups, and provide example strings that match and don't match.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("regex_test_cases", "Generate comprehensive test cases for a regex pattern including edge cases (Pro)", {
        pattern: z.string().describe("The regex pattern to test"),
        context: z.string().describe("What the pattern is intended to match (e.g. email, URL, phone)"),
        count: z.number().optional().describe("Number of test cases to generate"),
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
                        text: JSON.stringify({ error: "This tool requires a Pro subscription." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_regex_test_cases",
                        instructions: `Generate ${params.count || 10} test cases for regex '${params.pattern}' (context: ${params.context}). Include positive matches, negative matches, edge cases (unicode, empty strings, boundary conditions), and performance-problematic inputs (ReDoS patterns).`,
                    }, null, 2),
                },
            ],
        };
    });
}
