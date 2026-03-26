import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerServiceScaffoldTools(server) {
    server.tool("service_generate_boilerplate", "Generate microservice boilerplate code with standard project structure", {
        service_name: z.string().describe("Name of the microservice"),
        language: z.string().describe("Programming language (e.g. typescript, go, python, rust)"),
        framework: z.string().optional().describe("Framework to use (e.g. express, fastify, gin, fastapi)"),
        features: z.array(z.string()).optional().describe("Features to include (e.g. auth, database, queue)"),
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
                        action: "generate_boilerplate",
                        instructions: `Generate microservice boilerplate for '${params.service_name}' in '${params.language}'${params.framework ? ` using ${params.framework}` : ""}. ${params.features ? `Include features: ${params.features.join(", ")}.` : ""} Create project structure with src directory, configuration management, error handling, logging setup, Dockerfile, and test scaffolding.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("service_add_observability", "Add observability instrumentation to a service (metrics, logging, tracing)", {
        service_name: z.string().describe("Name of the service"),
        language: z.string().describe("Programming language of the service"),
        observability_stack: z.enum(["otel", "datadog", "newrelic", "custom"]).optional().describe("Observability stack"),
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
                        action: "add_observability",
                        instructions: `Add observability instrumentation to service '${params.service_name}' written in '${params.language}' using '${params.observability_stack ?? "otel"}'. Include structured logging with correlation IDs, RED metrics (Rate, Errors, Duration), distributed tracing with span attributes, and a /metrics endpoint. Add middleware for automatic HTTP instrumentation.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("service_add_healthcheck", "Add comprehensive health check endpoints to a service (Pro)", {
        service_name: z.string().describe("Name of the service"),
        language: z.string().describe("Programming language of the service"),
        dependencies: z.array(z.string()).optional().describe("External dependencies to check (e.g. database, redis, api)"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The service_add_healthcheck tool requires a Pro subscription. Please upgrade to access health check generation features." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_healthcheck",
                        instructions: `Add comprehensive health check endpoints to service '${params.service_name}' in '${params.language}'. Create /health/live (liveness), /health/ready (readiness), and /health/startup probes. ${params.dependencies ? `Check dependencies: ${params.dependencies.join(", ")}.` : ""} Include degraded state handling, timeout configuration, and Kubernetes probe compatibility.`,
                    }, null, 2),
                },
            ],
        };
    });
}
