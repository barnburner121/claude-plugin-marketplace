import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRagSetupTools(server) {
    server.tool("rag_generate_pipeline", "Generate RAG retrieval pipeline", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rag_generate_pipeline", directory, instructions: "Generate RAG retrieval pipeline in the specified directory." }, null, 2) }] };
    });
    server.tool("rag_add_chunking", "Add document chunking strategies", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "rag_add_chunking", directory, instructions: "Add document chunking strategies in the specified directory." }, null, 2) }] };
    });
    server.tool("rag_optimize_retrieval", "Optimize retrieval quality and speed (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "rag_optimize_retrieval", directory, instructions: "Optimize retrieval quality and speed in the specified directory." }, null, 2) }] };
    });
}
