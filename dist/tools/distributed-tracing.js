import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDistributedTracingTools(server) {
    server.tool("trace_setup_otel", "Set up OpenTelemetry SDK with tracing provider and exporters", {
        service_name: z.string().describe("Name of the service to instrument"),
        language: z.string().describe("Programming language (e.g. typescript, go, python, java)"),
        exporter: z.enum(["jaeger", "zipkin", "otlp", "console"]).optional().describe("Trace exporter (default otlp)"),
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
                        action: "setup_otel",
                        instructions: `Set up OpenTelemetry SDK for service '${params.service_name}' in '${params.language}' with '${params.exporter ?? "otlp"}' exporter. Configure TracerProvider with batch span processor, resource attributes (service.name, service.version, deployment.environment), and sampler configuration. Add auto-instrumentation for HTTP, gRPC, and database clients.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("trace_add_spans", "Add custom spans and attributes to instrument critical code paths", {
        service_name: z.string().describe("Name of the service"),
        language: z.string().describe("Programming language"),
        operations: z.array(z.string()).describe("List of operations to instrument (e.g. db_query, api_call, process_order)"),
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
                        action: "add_spans",
                        instructions: `Add custom spans to service '${params.service_name}' in '${params.language}' for operations: ${params.operations.join(", ")}. Include span attributes for input parameters, result status, and duration. Add span events for significant checkpoints, set span status on errors with exception recording, and propagate baggage for cross-service context.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("trace_configure_export", "Configure trace export pipelines with sampling and filtering (Pro)", {
        service_name: z.string().describe("Name of the service"),
        sampling_rate: z.number().optional().describe("Sampling rate between 0 and 1 (default 0.1)"),
        export_endpoint: z.string().optional().describe("Export endpoint URL"),
        tail_sampling: z.boolean().optional().describe("Enable tail-based sampling"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The trace_configure_export tool requires a Pro subscription. Please upgrade to access trace export configuration features." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "configure_export",
                        instructions: `Configure trace export for service '${params.service_name}' with sampling rate ${params.sampling_rate ?? 0.1}${params.export_endpoint ? ` exporting to '${params.export_endpoint}'` : ""}. ${params.tail_sampling ? "Enable tail-based sampling with error and latency policies." : "Use head-based probability sampling."} Configure batch processor with queue size, batch timeout, and retry settings. Add span filtering to exclude health check and readiness probe spans.`,
                    }, null, 2),
                },
            ],
        };
    });
}
