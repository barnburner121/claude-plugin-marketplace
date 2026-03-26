import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerSmartContractTestTools(server) {
    server.tool("sct_generate_tests", "Generate smart contract test suite", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "sct_generate_tests", directory, instructions: "Generate smart contract test suite in the specified directory." }, null, 2) }] };
    });
    server.tool("sct_add_fuzzing", "Add fuzz testing for contracts", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "sct_add_fuzzing", directory, instructions: "Add fuzz testing for contracts in the specified directory." }, null, 2) }] };
    });
    server.tool("sct_add_coverage", "Generate contract test coverage (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "sct_add_coverage", directory, instructions: "Generate contract test coverage in the specified directory." }, null, 2) }] };
    });
}
