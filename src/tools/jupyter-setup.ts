import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerJupyterSetupTools(server: McpServer) {
  server.tool("jupyter_init_project", "Initialize Jupyter notebook project with kernels", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "jupyter_init_project", directory, instructions: "Initialize Jupyter notebook project with kernels in the specified directory." }, null, 2) }] };
  });
  server.tool("jupyter_add_extensions", "Add Jupyter extensions and widgets", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "jupyter_add_extensions", directory, instructions: "Add Jupyter extensions and widgets in the specified directory." }, null, 2) }] };
  });
  server.tool("jupyter_configure_kernels", "Configure custom kernels and environments (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "jupyter_configure_kernels", directory, instructions: "Configure custom kernels and environments in the specified directory." }, null, 2) }] };
  });
}
