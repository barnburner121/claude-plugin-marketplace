import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPciScannerTools(server: McpServer) {
  server.tool("pci_scan_codebase", "Scan codebase for PCI-DSS issues", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "pci_scan_codebase", directory, instructions: "Scan codebase for PCI-DSS issues in the specified directory." }, null, 2) }] };
  });
  server.tool("pci_generate_checklist", "Generate PCI compliance checklist", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "pci_generate_checklist", directory, instructions: "Generate PCI compliance checklist in the specified directory." }, null, 2) }] };
  });
  server.tool("pci_generate_report", "Generate PCI compliance report (Pro feature)", { directory: z.string().describe("Project directory"), api_key: z.string().optional() }, async ({ directory, api_key }) => {
    const { allowed, tier } = checkRateLimit(api_key);
    if (!allowed) return rateLimitError(tier);
    if (tier === "free") { return { content: [{ type: "text" as const, text: "This is a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub" }] }; }
    return { content: [{ type: "text" as const, text: JSON.stringify({ action: "pci_generate_report", directory, instructions: "Generate PCI compliance report in the specified directory." }, null, 2) }] };
  });
}
