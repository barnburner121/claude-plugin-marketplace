import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerCssOptimizerTools(server: McpServer) {
  server.tool(
    "css_find_unused",
    "Find unused CSS selectors by comparing stylesheets against HTML/JSX content",
    {
      css: z.string().describe("CSS stylesheet content to analyze"),
      html: z.string().describe("HTML or JSX content to check selector usage against"),
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
                action: "find_unused_css",
                instructions:
                  "Parse the CSS stylesheet and extract all selectors. Cross-reference each selector against the provided HTML/JSX content to identify selectors that are never used. Account for dynamic class names, state-based classes (hover, active, focus), and media query contexts. Report each unused selector with its line number and the full rule block, along with the estimated bytes that can be saved by removing it.",
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
    "css_find_duplicates",
    "Find duplicate or overlapping CSS declarations and redundant rules",
    {
      css: z.string().describe("CSS stylesheet content to analyze for duplicates"),
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
                action: "find_duplicate_css",
                instructions:
                  "Analyze the CSS stylesheet for duplicate declarations, redundant rules, and overlapping selectors. Identify exact duplicate property-value pairs across different selectors, selectors that can be merged, shorthand properties that override individual properties, and declarations overridden by later rules with equal or higher specificity. Report each finding with locations and a suggested consolidation.",
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
    "css_optimize",
    "Optimize CSS by removing unused rules, merging duplicates, and applying best practices (Pro)",
    {
      css: z.string().describe("CSS stylesheet content to optimize"),
      html: z.string().optional().describe("HTML/JSX content for unused rule detection"),
      options: z.string().optional().describe("Optimization options: 'minify', 'merge', 'sort', 'modernize'"),
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
                    "This tool requires a Pro subscription. Upgrade to Pro to fully optimize your CSS with unused rule removal, duplicate merging, modern syntax upgrades, and minification.",
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
                action: "optimize_css",
                instructions:
                  "Perform comprehensive CSS optimization: remove unused selectors (if HTML provided), merge duplicate rules, consolidate overlapping declarations into shorthands, sort properties consistently, replace legacy syntax with modern alternatives (e.g., logical properties, modern color formats), and optionally minify the output. Provide the optimized CSS along with a summary of changes and bytes saved.",
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
