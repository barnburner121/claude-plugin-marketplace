import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRedisStreamsTools(server) {
    server.tool("rstreams_generate_producer", "Generate Redis Streams producer", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rstreams_generate_producer", directory, instructions: "Generate Redis Streams producer in the specified directory." }, null, 2) }] };
    });
    server.tool("rstreams_generate_consumer", "Generate Redis Streams consumer group", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rstreams_generate_consumer", directory, instructions: "Generate Redis Streams consumer group in the specified directory." }, null, 2) }] };
    });
    server.tool("rstreams_add_processing", "Generate stream processing pipeline (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "rstreams_add_processing", directory, instructions: "Generate stream processing pipeline in the specified directory." }, null, 2) }] };
    });
}
