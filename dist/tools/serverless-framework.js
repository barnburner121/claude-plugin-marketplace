import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerServerlessFrameworkTools(server) {
    server.tool("sls_generate_config", "Generate a Serverless Framework configuration file with provider settings and plugins", {
        service_name: z.string().describe("Service name"),
        provider: z.enum(["aws", "azure", "gcp"]).describe("Cloud provider"),
        runtime: z.string().describe("Runtime (e.g. nodejs20.x, python3.12)"),
        region: z.string().optional().describe("Deployment region"),
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
                        action: "generate_serverless_config",
                        instructions: `Generate a serverless.yml for service '${params.service_name}' on ${params.provider} with ${params.runtime} runtime${params.region ? ` in ${params.region}` : ""}. Include stage-based configuration, environment variables, IAM role statements, and recommended plugins (serverless-offline, serverless-prune).`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("sls_add_functions", "Add function definitions with event triggers to a Serverless Framework config", {
        service_name: z.string().describe("Service name"),
        functions: z.array(z.object({
            name: z.string().describe("Function name"),
            handler: z.string().describe("Handler path"),
            event: z.enum(["http", "httpApi", "sqs", "s3", "schedule", "stream"]).describe("Event type"),
        })).describe("Function definitions to add"),
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
                        action: "add_serverless_functions",
                        instructions: `Add ${params.functions.length} function(s) to service '${params.service_name}': ${params.functions.map((f) => `${f.name} (${f.event} -> ${f.handler})`).join(", ")}. Include event configuration, timeout settings, memory allocation, and environment variable references.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("sls_optimize", "Optimize Serverless Framework deployment for cold starts, bundle size, and cost (Pro)", {
        service_name: z.string().describe("Service name"),
        concerns: z.array(z.enum(["cold-start", "bundle-size", "cost", "security", "monitoring"])).describe("Optimization concerns"),
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
                        action: "optimize_serverless",
                        instructions: `Optimize Serverless Framework service '${params.service_name}' for: ${params.concerns.join(", ")}. Recommend webpack/esbuild bundling, provisioned concurrency, ARM64 architecture, layer extraction, and monitoring with X-Ray or Datadog plugin.`,
                    }, null, 2),
                },
            ],
        };
    });
}
