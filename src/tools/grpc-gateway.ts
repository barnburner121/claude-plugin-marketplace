import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerGrpcGatewayTools(server: McpServer) {
  server.tool("grpcgw_generate", "Generate gRPC-Gateway HTTP bridge", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "grpcgw_generate", directory, instructions: "Generate gRPC-Gateway HTTP bridge in the specified directory." }, null, 2) }] };
  });
  server.tool("grpcgw_add_swagger", "Add Swagger from gRPC definitions", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "grpcgw_add_swagger", directory, instructions: "Add Swagger from gRPC definitions in the specified directory." }, null, 2) }] };
  });
  server.tool("grpcgw_optimize", "Optimize gateway performance (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "grpcgw_optimize", directory, instructions: "Optimize gateway performance in the specified directory." }, null, 2) }] };
  });
}
