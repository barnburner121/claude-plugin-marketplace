import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerLambdaBuilderTools(server) {
    server.tool("lambda_generate_function", "Generate an AWS Lambda function with boilerplate code, handler setup, and event typing", {
        runtime: z.enum(["nodejs18.x", "nodejs20.x", "python3.11", "python3.12"]).describe("Lambda runtime environment"),
        trigger: z.enum(["api-gateway", "s3", "sqs", "dynamodb", "schedule"]).describe("Event trigger type"),
        name: z.string().describe("Function name"),
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
                        action: "generate_lambda_function",
                        instructions: `Generate an AWS Lambda function named '${params.name}' using the ${params.runtime} runtime, triggered by ${params.trigger}. Include proper event typing, error handling, structured logging, and a cold-start optimization pattern.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("lambda_configure_iam", "Generate least-privilege IAM role and policy for a Lambda function", {
        function_name: z.string().describe("Lambda function name"),
        services: z.array(z.string()).describe("AWS services the function needs access to (e.g. s3, dynamodb, sqs)"),
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
                        action: "configure_lambda_iam",
                        instructions: `Generate a least-privilege IAM role and policy for Lambda function '${params.function_name}' with access to: ${params.services.join(", ")}. Include trust policy, execution role, and resource-scoped permissions.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("lambda_add_layers", "Configure Lambda layers for shared dependencies and utilities (Pro)", {
        function_name: z.string().describe("Lambda function name"),
        layers: z.array(z.string()).describe("Layer names or ARNs to attach"),
        create_custom: z.boolean().optional().describe("Whether to create a custom layer"),
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
                        action: "add_lambda_layers",
                        instructions: `Configure Lambda layers for function '${params.function_name}'. Attach layers: ${params.layers.join(", ")}. ${params.create_custom ? "Create a custom layer with packaging scripts and dependency management." : "Reference existing layer ARNs."} Include version pinning and compatibility checks.`,
                    }, null, 2),
                },
            ],
        };
    });
}
