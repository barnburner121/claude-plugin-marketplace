import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerMakefileGenTools(server) {
    server.tool("make_generate", "Generate a Makefile with standard targets for build, test, lint, and clean", {
        project_type: z.enum(["node", "python", "go", "rust", "c", "cpp", "docker"]).describe("Project type"),
        name: z.string().describe("Project name"),
        include_docker: z.boolean().optional().describe("Include Docker build targets"),
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
                        action: "generate_makefile",
                        instructions: `Generate a Makefile for ${params.project_type} project '${params.name}'. Include standard targets: all, build, test, lint, clean, install. ${params.include_docker ? "Add Docker build, push, and run targets." : ""} Use .PHONY declarations, variable definitions, and help target with auto-documentation.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("make_add_targets", "Add custom Makefile targets with dependencies and recipes", {
        targets: z.array(z.object({
            name: z.string().describe("Target name"),
            description: z.string().describe("Target description"),
            dependencies: z.array(z.string()).optional().describe("Target dependencies"),
        })).describe("Targets to add"),
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
                        action: "add_makefile_targets",
                        instructions: `Add ${params.targets.length} target(s) to the Makefile: ${params.targets.map((t) => `'${t.name}' (${t.description}${t.dependencies ? `, depends on: ${t.dependencies.join(", ")}` : ""})`).join("; ")}. Include proper dependency ordering, error handling, and .PHONY declarations.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("make_optimize", "Optimize a Makefile for parallel execution, caching, and CI/CD integration (Pro)", {
        concerns: z.array(z.enum(["parallel", "caching", "ci-cd", "cross-platform", "incremental"])).describe("Optimization concerns"),
        ci_platform: z.enum(["github-actions", "gitlab-ci", "circleci", "jenkins"]).optional().describe("CI platform for integration"),
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
                        action: "optimize_makefile",
                        instructions: `Optimize Makefile for: ${params.concerns.join(", ")}. ${params.ci_platform ? `Integrate with ${params.ci_platform}.` : ""} Add parallel job support (-j flag patterns), file-based caching with checksums, conditional execution, and platform detection for cross-platform compatibility.`,
                    }, null, 2),
                },
            ],
        };
    });
}
