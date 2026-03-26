import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPipelineOpsTools(server) {
    // Tool 1: Generate CI/CD pipeline
    server.tool("pipeline_generate", "Generate a complete CI/CD pipeline configuration for your project", {
        platform: z
            .enum([
            "github-actions",
            "gitlab-ci",
            "circleci",
            "buildkite",
            "jenkins",
        ])
            .describe("CI/CD platform"),
        language: z
            .string()
            .describe("Primary language/framework (e.g., 'node', 'python', 'go')"),
        features: z
            .array(z.enum([
            "lint",
            "test",
            "build",
            "security-scan",
            "docker",
            "deploy-staging",
            "deploy-prod",
            "notify",
            "cache",
            "matrix",
        ]))
            .describe("Pipeline features to include"),
        deploy_target: z
            .enum(["aws", "gcp", "azure", "vercel", "railway", "fly", "k8s"])
            .optional()
            .describe("Deployment target"),
        api_key: z.string().optional(),
    }, async ({ platform, language, features, deploy_target, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_pipeline",
                        platform,
                        language,
                        features,
                        deploy_target,
                        instructions: `Generate a complete ${platform} pipeline configuration for a ${language} project. Include these stages: ${features.join(", ")}. ${deploy_target ? `Deploy to ${deploy_target}.` : ""} Requirements: (1) Use caching for dependencies, (2) Run tests in parallel where possible, (3) Include proper secret management, (4) Add status badges, (5) Include manual approval gate for production deploys, (6) Add Slack/Discord notification on failure. Write the config file to the correct location for ${platform}.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: Debug failing pipeline
    server.tool("pipeline_debug", "Analyze CI/CD pipeline logs to diagnose build failures and suggest fixes", {
        log_content: z
            .string()
            .describe("Pipeline log output (paste the failing log) or path to log file"),
        platform: z
            .enum([
            "github-actions",
            "gitlab-ci",
            "circleci",
            "buildkite",
            "jenkins",
        ])
            .optional(),
        api_key: z.string().optional(),
    }, async ({ log_content, platform, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "debug_pipeline",
                        log_content: log_content.length > 5000
                            ? log_content.slice(-5000)
                            : log_content,
                        platform,
                        instructions: "Analyze the pipeline log for: (1) The root cause of failure (not just the symptom), (2) Whether it's a code issue, dependency issue, environment issue, or infra issue, (3) Specific fix with code/config changes needed, (4) Whether this is a flaky test or consistent failure, (5) Similar past issues and their solutions. Provide a clear diagnosis and step-by-step fix.",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: Pipeline optimization
    server.tool("pipeline_optimize", "Analyze existing pipeline config and suggest optimizations for speed and cost", {
        config_path: z
            .string()
            .describe("Path to pipeline config file"),
        api_key: z.string().optional(),
    }, async ({ config_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "optimize_pipeline",
                        config_path,
                        instructions: `Read the pipeline config at ${config_path}. Analyze for: (1) Steps that can run in parallel but currently run sequentially, (2) Missing or suboptimal caching (dependencies, build artifacts, Docker layers), (3) Unnecessary steps that could be skipped conditionally, (4) Resource sizing (over/under-provisioned runners), (5) Duplicate work across jobs, (6) Estimated time savings for each optimization. Provide the optimized config with before/after comparison.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 4: Multi-environment pipeline matrix (Pro)
    server.tool("pipeline_matrix", "Generate a multi-environment test matrix pipeline with proper promotion gates (Pro feature)", {
        environments: z
            .array(z.string())
            .default(["dev", "staging", "prod"])
            .describe("Deployment environments"),
        platform: z
            .enum(["github-actions", "gitlab-ci", "circleci"])
            .default("github-actions"),
        test_matrix: z
            .object({
            node_versions: z.array(z.string()).optional(),
            os: z.array(z.string()).optional(),
            databases: z.array(z.string()).optional(),
        })
            .optional()
            .describe("Test matrix dimensions"),
        api_key: z.string().optional(),
    }, async ({ environments, platform, test_matrix, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: "Pipeline matrix generation is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_matrix_pipeline",
                        environments,
                        platform,
                        test_matrix,
                        instructions: `Generate a ${platform} pipeline with: (1) Test matrix across ${JSON.stringify(test_matrix)}, (2) Promotion gates between ${environments.join(" → ")}, (3) Environment-specific configs and secrets, (4) Rollback steps on failure, (5) Canary deployment for production, (6) Health checks after each deploy, (7) Notification on promotion/failure.`,
                    }, null, 2),
                },
            ],
        };
    });
}
