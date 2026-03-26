import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerS3ManagerTools(server) {
    server.tool("s3_generate_policy", "Generate S3 bucket policies with least-privilege access controls", {
        bucket_name: z.string().describe("S3 bucket name"),
        access_type: z.enum(["public-read", "private", "cross-account", "cloudfront-oai"]).describe("Access pattern type"),
        principals: z.array(z.string()).optional().describe("AWS account IDs or ARNs for cross-account access"),
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
                        action: "generate_s3_policy",
                        instructions: `Generate an S3 bucket policy for '${params.bucket_name}' with ${params.access_type} access. ${params.principals ? `Grant access to principals: ${params.principals.join(", ")}.` : ""} Include deny statements for unencrypted transport, versioning recommendations, and block public access settings.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("s3_configure_lifecycle", "Configure S3 lifecycle rules for storage class transitions and expiration", {
        bucket_name: z.string().describe("S3 bucket name"),
        strategy: z.enum(["cost-optimize", "compliance", "archive", "cleanup"]).describe("Lifecycle strategy"),
        retention_days: z.number().optional().describe("Number of days before transition or expiration"),
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
                        action: "configure_s3_lifecycle",
                        instructions: `Configure S3 lifecycle rules for bucket '${params.bucket_name}' using the '${params.strategy}' strategy. ${params.retention_days ? `Set retention to ${params.retention_days} days.` : ""} Include storage class transitions (Standard -> IA -> Glacier), incomplete multipart upload cleanup, and noncurrent version expiration.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("s3_setup_cors", "Configure S3 CORS rules for cross-origin browser access (Pro)", {
        bucket_name: z.string().describe("S3 bucket name"),
        allowed_origins: z.array(z.string()).describe("Allowed origin domains"),
        allowed_methods: z.array(z.enum(["GET", "PUT", "POST", "DELETE", "HEAD"])).describe("Allowed HTTP methods"),
        max_age: z.number().optional().describe("Preflight cache duration in seconds"),
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
                        action: "setup_s3_cors",
                        instructions: `Configure CORS for S3 bucket '${params.bucket_name}'. Allow origins: ${params.allowed_origins.join(", ")}. Allow methods: ${params.allowed_methods.join(", ")}. ${params.max_age ? `Set preflight cache to ${params.max_age}s.` : ""} Include exposed headers, allowed headers, and security best practices.`,
                    }, null, 2),
                },
            ],
        };
    });
}
