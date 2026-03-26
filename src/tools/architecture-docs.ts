import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerArchitectureDocsTools(server: McpServer) {
  server.tool(
    "arch_analyze_structure",
    "Analyze project structure and identify architectural patterns, layers, and dependencies",
    {
      file_tree: z.string().describe("Project file tree or directory listing"),
      source_samples: z.string().optional().describe("Key source file contents for deeper analysis"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "analyze_project_structure",
                instructions:
                  "Analyze the provided file tree and source samples to identify the architectural pattern (MVC, layered, microservices, hexagonal, etc.). Map out the dependency graph between modules, identify entry points, shared utilities, and data flow. Produce a structured summary of layers, components, and their responsibilities.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "arch_generate_diagram",
    "Generate architecture diagram markup (Mermaid or PlantUML) from project analysis",
    {
      architecture_summary: z.string().describe("Architecture analysis summary or component descriptions"),
      diagram_type: z.string().optional().describe("Diagram type: 'component', 'sequence', 'class', or 'deployment'"),
      format: z.string().optional().describe("Output format: 'mermaid' or 'plantuml'"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_architecture_diagram",
                instructions:
                  "Using the provided architecture summary, generate a diagram in the requested format (Mermaid or PlantUML). Create clear component boxes, directional arrows showing data flow and dependencies, and group related components into subgraphs. Use proper labels and styling for readability.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  server.tool(
    "arch_generate_docs",
    "Generate comprehensive architecture documentation from project analysis (Pro)",
    {
      architecture_summary: z.string().describe("Architecture analysis summary"),
      source_code: z.string().optional().describe("Key source files for detailed documentation"),
      include_decisions: z.boolean().optional().describe("Include architecture decision records (ADRs)"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier === "free") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  action: "upgrade_required",
                  instructions:
                    "This tool requires a Pro subscription. Upgrade to Pro to generate comprehensive architecture documentation including system overviews, component details, and architecture decision records.",
                },
                null,
                2
              ),
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                action: "generate_architecture_docs",
                instructions:
                  "Generate comprehensive architecture documentation including a system overview, component descriptions with responsibilities and interfaces, data flow documentation, deployment architecture, and optionally architecture decision records (ADRs). Format as structured markdown suitable for a docs site.",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
