import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerQueueBuilderTools(server) {
    server.tool("queue_setup_bullmq", "Set up BullMQ queues with job definitions, priorities, and rate limiting", {
        queue_names: z.array(z.string()).describe("Names of queues to create (e.g. 'email', 'image-processing')"),
        redis_url: z.string().default("redis://localhost:6379").describe("Redis connection URL"),
        include_dashboard: z.boolean().default(true).describe("Whether to include Bull Board dashboard setup"),
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
                        action: "setup_bullmq_queues",
                        instructions: `Set up BullMQ queues: ${params.queue_names.join(", ")} connecting to ${params.redis_url}. Configure job priorities, rate limiting per queue, job TTL, and removal on completion policies. ${params.include_dashboard ? "Add Bull Board dashboard for monitoring queue status." : ""} Include typed job data interfaces, queue event listeners, and connection error handling.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("queue_setup_workers", "Generate worker processes with concurrency control and graceful shutdown", {
        queue_name: z.string().describe("Queue name the worker processes"),
        concurrency: z.number().default(5).describe("Number of concurrent jobs"),
        sandboxed: z.boolean().default(false).describe("Whether to run workers in sandboxed child processes"),
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
                        action: "setup_queue_workers",
                        instructions: `Generate a BullMQ worker for the '${params.queue_name}' queue with concurrency of ${params.concurrency}. ${params.sandboxed ? "Run the processor in a sandboxed child process for isolation." : ""} Implement graceful shutdown handling (SIGTERM/SIGINT), job progress reporting, structured logging per job, and health check endpoints. Add job-level timeout enforcement and memory usage monitoring.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("queue_add_retry_logic", "Pro: Add advanced retry strategies with exponential backoff, dead letter queues, and alerting", {
        queue_name: z.string().describe("Queue name to add retry logic to"),
        max_retries: z.number().default(3).describe("Maximum number of retry attempts"),
        backoff_type: z.enum(["exponential", "linear", "fixed", "custom"]).default("exponential").describe("Backoff strategy"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The queue_add_retry_logic tool requires a Pro subscription. Please upgrade to access advanced retry logic." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_queue_retry_logic",
                        instructions: `Add ${params.backoff_type} retry logic to the '${params.queue_name}' queue with max ${params.max_retries} retries. Configure a dead letter queue for permanently failed jobs, add failure alerting via webhook/email, implement circuit breaker patterns for downstream service failures, and add retry attempt metadata tracking. Include manual retry/replay tooling for DLQ jobs.`,
                    }, null, 2),
                },
            ],
        };
    });
}
