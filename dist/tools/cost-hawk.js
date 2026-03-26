import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCostHawkTools(server) {
    // Tool 1: Analyze cloud infrastructure costs from config files
    server.tool("cost_analyze_infra", "Analyze infrastructure-as-code files to estimate costs and find savings opportunities", {
        directory: z
            .string()
            .describe("Directory with IaC files (Terraform, CloudFormation, etc.)"),
        provider: z
            .enum(["aws", "gcp", "azure", "multi"])
            .default("aws")
            .describe("Cloud provider"),
        api_key: z.string().optional(),
    }, async ({ directory, provider, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "analyze_infra_costs",
                        directory,
                        provider,
                        instructions: `Read all IaC files in ${directory} (.tf, .yaml, .json CloudFormation, etc.). For each resource: (1) Identify the resource type and size, (2) Estimate monthly cost based on ${provider} pricing, (3) Flag over-provisioned resources (e.g., m5.xlarge for a low-traffic API), (4) Suggest right-sizing options with cost savings, (5) Identify resources that could use spot/preemptible instances, (6) Check for missing auto-scaling configs, (7) Flag idle resources (provisioned but likely unused). Output a cost breakdown table and total estimated monthly spend.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 2: Docker image size optimization
    server.tool("cost_optimize_docker", "Analyze Dockerfiles for image size reduction and build time optimization", {
        dockerfile_path: z
            .string()
            .default("Dockerfile")
            .describe("Path to Dockerfile"),
        api_key: z.string().optional(),
    }, async ({ dockerfile_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "optimize_docker",
                        dockerfile_path,
                        instructions: `Read ${dockerfile_path}. Analyze for: (1) Base image optimization (alpine vs slim vs full), (2) Multi-stage build opportunities, (3) Layer caching improvements (order of COPY/RUN), (4) Unnecessary files included (.git, node_modules dev deps, test files), (5) Missing .dockerignore entries, (6) Security issues (running as root, exposed secrets in layers), (7) Estimate current vs optimized image size. Provide an optimized Dockerfile with comments explaining each change.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 3: Database cost optimization
    server.tool("cost_optimize_database", "Analyze database queries and schema for cost optimization opportunities (Pro feature)", {
        directory: z.string().describe("Project source directory"),
        db_type: z
            .enum(["postgres", "mysql", "mongodb", "dynamodb", "redis"])
            .describe("Database type"),
        api_key: z.string().optional(),
    }, async ({ directory, db_type, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: "Database cost optimization is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "optimize_database_costs",
                        directory,
                        db_type,
                        instructions: `Scan ${directory} for database queries. Analyze: (1) Queries missing indexes (full table scans), (2) N+1 query patterns, (3) Over-fetching (SELECT * when only a few columns needed), (4) Missing connection pooling, (5) Queries that could be cached, (6) Schema denormalization opportunities for read-heavy tables, (7) Unused indexes (indexes that add write cost but aren't queried). For ${db_type}, suggest specific index creation statements and query rewrites.`,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool 4: Monthly cost report generator
    server.tool("cost_generate_report", "Generate a monthly cost optimization report template for your infrastructure", {
        services: z
            .array(z.string())
            .describe("List of cloud services in use (e.g., EC2, RDS, S3, Lambda)"),
        monthly_budget: z
            .number()
            .optional()
            .describe("Monthly budget in USD"),
        api_key: z.string().optional(),
    }, async ({ services, monthly_budget, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_cost_report",
                        services,
                        monthly_budget,
                        instructions: `Generate a cost optimization report template covering: (1) Per-service cost breakdown for: ${services.join(", ")}, (2) Month-over-month trend analysis template, (3) Top 5 cost drivers identification, (4) Savings recommendations with estimated impact, (5) Reserved instance / savings plan opportunities, (6) Unused resource cleanup checklist, ${monthly_budget ? `(7) Budget utilization (${monthly_budget} USD/month target),` : ""} (8) Action items with owners and deadlines. Output as a Markdown report template.`,
                    }, null, 2),
                },
            ],
        };
    });
}
