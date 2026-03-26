import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDepShieldTools(server) {
    // Tool 1: Audit dependencies for vulnerabilities
    server.tool("dep_audit", "Scan project dependencies for known vulnerabilities, outdated packages, and license issues", {
        directory: z.string().describe("Project root directory"),
        package_manager: z
            .enum(["npm", "yarn", "pnpm", "pip", "cargo", "go", "maven", "gradle"])
            .optional()
            .describe("Package manager (auto-detected if omitted)"),
        api_key: z.string().optional(),
    }, async ({ directory, package_manager, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        const lockFiles = {
            npm: "package-lock.json",
            yarn: "yarn.lock",
            pnpm: "pnpm-lock.yaml",
            pip: "requirements.txt",
            cargo: "Cargo.lock",
            go: "go.sum",
            maven: "pom.xml",
            gradle: "build.gradle",
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "audit_dependencies",
                        directory,
                        package_manager,
                        lock_files: lockFiles,
                        instructions: `In ${directory}: (1) Detect the package manager by looking for lock files: ${Object.values(lockFiles).join(", ")}. (2) Read the manifest and lock file. (3) Run the appropriate audit command (npm audit, pip-audit, cargo audit, etc.) via Bash. (4) Parse the results and categorize by severity (critical/high/medium/low). (5) For each vulnerability, provide: package name, current version, fixed version, CVE ID, and description. (6) Suggest a remediation plan prioritized by severity.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: Check for outdated dependencies
    server.tool("dep_outdated", "List all outdated dependencies with available updates and breaking change warnings", {
        directory: z.string().describe("Project root directory"),
        include_dev: z
            .boolean()
            .default(true)
            .describe("Include dev dependencies"),
        api_key: z.string().optional(),
    }, async ({ directory, include_dev, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "check_outdated",
                        directory,
                        include_dev,
                        instructions: `In ${directory}: (1) Run the appropriate outdated check (npm outdated, pip list --outdated, etc.). (2) For each outdated package, show: current version, latest version, and whether the update is major/minor/patch. (3) Flag major version bumps with potential breaking changes. (4) Suggest a safe update order (update minor/patch first, then majors one at a time). (5) ${include_dev ? "Include" : "Exclude"} dev dependencies.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: License compliance check
    server.tool("dep_license_check", "Scan all dependency licenses and flag incompatible or risky licenses (Pro feature)", {
        directory: z.string().describe("Project root directory"),
        allowed_licenses: z
            .array(z.string())
            .default(["MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0"])
            .describe("List of allowed license types"),
        project_license: z
            .string()
            .default("MIT")
            .describe("Your project's license"),
        api_key: z.string().optional(),
    }, async ({ directory, allowed_licenses, project_license, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: "License compliance checking is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "license_check",
                        directory,
                        allowed_licenses,
                        project_license,
                        instructions: `In ${directory}: (1) Read the package manifest. (2) For each dependency (and transitive dependency), determine the license. (3) Flag any licenses NOT in the allowed list: ${allowed_licenses.join(", ")}. (4) Specifically warn about: GPL (copyleft risk), AGPL (network copyleft), SSPL (cloud restriction), unlicensed (legal risk). (5) Check compatibility with the project's ${project_license} license. (6) Generate a LICENSES.md file listing all dependencies and their licenses.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 4: Generate dependency update PR
    server.tool("dep_update_plan", "Generate a safe dependency update plan with test verification steps", {
        directory: z.string().describe("Project root directory"),
        scope: z
            .enum(["patch", "minor", "major", "all"])
            .default("minor")
            .describe("Update scope"),
        api_key: z.string().optional(),
    }, async ({ directory, scope, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "update_plan",
                        directory,
                        scope,
                        instructions: `In ${directory}: (1) Check for all ${scope === "all" ? "" : scope + " "}updates available. (2) Group updates into safe batches (related packages together). (3) For each batch, provide: packages to update, commands to run, what to test after, and rollback steps. (4) Order batches from safest to riskiest. (5) Include a pre-update checklist: ensure tests pass, commit current state, check changelogs for breaking changes.`,
                    }, null, 2),
                },
            ],
        };
    });
}
