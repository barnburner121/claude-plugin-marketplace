import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCircuitBreakerTools(server) {
    server.tool("cb_generate_pattern", "Generate a circuit breaker implementation for service-to-service communication", {
        service_name: z.string().describe("Name of the calling service"),
        target_service: z.string().describe("Name of the target service to protect"),
        language: z.string().describe("Programming language (e.g. typescript, go, python, java)"),
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
                        action: "generate_pattern",
                        instructions: `Generate a circuit breaker implementation in '${params.language}' for service '${params.service_name}' calling '${params.target_service}'. Implement closed, open, and half-open states with configurable failure thresholds, timeout durations, and success thresholds for recovery. Include state change event hooks and metrics emission.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("cb_add_fallbacks", "Add fallback strategies to a circuit breaker implementation", {
        service_name: z.string().describe("Name of the service"),
        fallback_type: z.enum(["cache", "default", "degraded", "queue"]).describe("Type of fallback strategy"),
        language: z.string().describe("Programming language"),
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
                        action: "add_fallbacks",
                        instructions: `Add a '${params.fallback_type}' fallback strategy to the circuit breaker in service '${params.service_name}' using '${params.language}'. ${params.fallback_type === "cache" ? "Return cached responses when the circuit is open." : params.fallback_type === "default" ? "Return safe default values when the circuit is open." : params.fallback_type === "degraded" ? "Provide degraded functionality with reduced features." : "Queue requests for later processing when the circuit is open."} Include fallback metrics and logging.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("cb_configure_thresholds", "Configure and tune circuit breaker thresholds based on traffic patterns (Pro)", {
        service_name: z.string().describe("Name of the service"),
        avg_latency_ms: z.number().describe("Average latency in milliseconds"),
        error_rate_percent: z.number().describe("Current error rate percentage"),
        requests_per_second: z.number().describe("Average requests per second"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The cb_configure_thresholds tool requires a Pro subscription. Please upgrade to access circuit breaker threshold tuning features." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "configure_thresholds",
                        instructions: `Configure circuit breaker thresholds for service '${params.service_name}' based on: avg latency ${params.avg_latency_ms}ms, error rate ${params.error_rate_percent}%, throughput ${params.requests_per_second} req/s. Calculate optimal failure threshold, timeout duration, half-open request limit, sliding window size, and slow call duration threshold. Provide a tuning rationale and monitoring recommendations.`,
                    }, null, 2),
                },
            ],
        };
    });
}
