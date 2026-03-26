import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerKafkaSetupTools(server) {
    server.tool("kafka_generate_producer", "Generate Kafka producer setup", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "kafka_generate_producer", directory, instructions: "Generate Kafka producer setup in the specified directory." }, null, 2) }] };
    });
    server.tool("kafka_generate_consumer", "Generate Kafka consumer with groups", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "kafka_generate_consumer", directory, instructions: "Generate Kafka consumer with groups in the specified directory." }, null, 2) }] };
    });
    server.tool("kafka_add_schemas", "Generate Kafka schema registry setup (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "kafka_add_schemas", directory, instructions: "Generate Kafka schema registry setup in the specified directory." }, null, 2) }] };
    });
}
