import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerBlogEngineTools(server: McpServer) {
  server.tool("blog_generate_setup", "Generate blog engine with MDX", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "blog_generate_setup", directory, instructions: "Generate blog engine with MDX in the specified directory." }, null, 2) }] };
  });
  server.tool("blog_add_rss", "Add RSS feed generation", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "blog_add_rss", directory, instructions: "Add RSS feed generation in the specified directory." }, null, 2) }] };
  });
  server.tool("blog_add_seo", "Generate blog SEO optimization (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "blog_add_seo", directory, instructions: "Generate blog SEO optimization in the specified directory." }, null, 2) }] };
  });
}
