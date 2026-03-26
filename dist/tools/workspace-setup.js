import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerWorkspaceSetupTools(server) {
    server.tool("workspace_generate_monorepo", "Generate a monorepo workspace structure with package management", {
        workspace_name: z.string().describe("Name of the monorepo workspace"),
        package_manager: z.enum(["npm", "pnpm", "yarn", "bun"]).describe("Package manager for workspace management"),
        packages: z.array(z.string()).optional().describe("Initial package names to create"),
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
                        action: "generate_monorepo",
                        instructions: `Generate a monorepo workspace named '${params.workspace_name}' using '${params.package_manager}' workspaces. ${params.packages ? `Create initial packages: ${params.packages.join(", ")}.` : "Create apps and packages directories."} Configure workspace root with shared tsconfig, eslint config, and prettier config. Add workspace-level scripts for building, testing, and linting all packages. Include .npmrc and workspace protocol dependencies.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("workspace_configure_turborepo", "Configure Turborepo for optimized monorepo builds and caching", {
        workspace_name: z.string().describe("Name of the workspace"),
        pipelines: z.array(z.string()).optional().describe("Pipeline tasks to configure (e.g. build, test, lint, deploy)"),
        remote_cache: z.boolean().optional().describe("Enable remote caching"),
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
                        action: "configure_turborepo",
                        instructions: `Configure Turborepo for workspace '${params.workspace_name}' with pipelines: ${(params.pipelines ?? ["build", "test", "lint"]).join(", ")}. Define task dependencies, outputs for caching, input file globs, and environment variable passthrough. ${params.remote_cache ? "Enable remote caching with Vercel Remote Cache configuration." : "Configure local caching only."} Add turbo.json with optimal parallel execution settings and pruned workspace support.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("workspace_add_packages", "Add new packages to a monorepo with shared configuration and dependencies (Pro)", {
        workspace_name: z.string().describe("Name of the workspace"),
        package_name: z.string().describe("Name of the new package to add"),
        package_type: z.enum(["app", "library", "config", "tool"]).describe("Type of package"),
        dependencies: z.array(z.string()).optional().describe("Internal workspace dependencies"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The workspace_add_packages tool requires a Pro subscription. Please upgrade to access package creation features in monorepo workspaces." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_package",
                        instructions: `Add a new '${params.package_type}' package named '${params.package_name}' to workspace '${params.workspace_name}'. ${params.dependencies ? `Add internal dependencies: ${params.dependencies.join(", ")}.` : ""} Create package.json extending shared configs, add TypeScript configuration inheriting from root, set up build and test scripts, configure package exports and main entry points, and add the package to the workspace dependency graph.`,
                    }, null, 2),
                },
            ],
        };
    });
}
