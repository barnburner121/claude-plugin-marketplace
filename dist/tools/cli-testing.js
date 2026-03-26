import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerCliTestingTools(server) {
    server.tool("clitest_generate_suite", "Generate CLI integration tests", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "clitest_generate_suite", directory, instructions: "Generate CLI integration tests in the specified directory." }, null, 2) }] };
    });
    server.tool("clitest_add_snapshots", "Add CLI output snapshot tests", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return { content: [{ type: "text", text: JSON.stringify({ action: "clitest_add_snapshots", directory, instructions: "Add CLI output snapshot tests in the specified directory." }, null, 2) }] };
    });
    server.tool("clitest_add_mocks", "Generate CLI mock utilities (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return { content: [{ type: "text", text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] };
        }
        return { content: [{ type: "text", text: JSON.stringify({ action: "clitest_add_mocks", directory, instructions: "Generate CLI mock utilities in the specified directory." }, null, 2) }] };
    });
}
