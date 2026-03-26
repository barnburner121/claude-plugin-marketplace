import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPricingPageTools(server: McpServer) {
  server.tool(
    "pricing_table_component",
    "Generate a responsive pricing table component with plan comparison and feature lists",
    {
      framework: z.enum(["react", "vue", "svelte", "html"]).default("react"),
      plans: z.array(z.object({ name: z.string(), monthly_price: z.number(), features: z.array(z.string()) })),
      highlight_plan: z.string().optional().describe("Plan name to highlight as recommended"),
      style: z.enum(["cards", "table", "minimal"]).default("cards"),
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
                action: "create_pricing_table",
                instructions: `Create a ${params.style}-style pricing table component in ${params.framework} with ${params.plans.length} plans. ${params.highlight_plan ? `Highlight the "${params.highlight_plan}" plan as recommended.` : ""} Include monthly/annual toggle with annual discount display. Each plan card shows name, price, feature list with check/x icons, and a CTA button. Make it fully responsive with a stacked layout on mobile. Use CSS Grid or Flexbox for layout. Add hover animations and accessible ARIA labels.`,
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
    "pricing_toggle",
    "Create a monthly/annual pricing toggle with animated price transitions",
    {
      framework: z.enum(["react", "vue", "svelte"]).default("react"),
      annual_discount_percent: z.number().default(20),
      animation: z.enum(["slide", "fade", "flip"]).default("fade"),
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
                  instructions: "The animated pricing toggle component is a Pro feature. Upgrade to access advanced UI components with smooth animations and annual discount calculations.",
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
                action: "create_pricing_toggle",
                instructions: `Create a monthly/annual pricing toggle in ${params.framework} with ${params.animation} animation. Apply ${params.annual_discount_percent}% discount for annual billing. Show a "Save ${params.annual_discount_percent}%" badge next to the annual option. Animate price changes with CSS transitions or framer-motion. Store billing interval in component state and pass to pricing cards via props or context. Include keyboard accessibility for the toggle.`,
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
    "feature_comparison_matrix",
    "Generate a feature comparison matrix showing capabilities across plans",
    {
      framework: z.enum(["react", "vue", "svelte", "html"]).default("react"),
      plans: z.array(z.string()).describe("Plan names for columns"),
      categories: z.array(z.object({ name: z.string(), features: z.array(z.string()) })).describe("Feature categories"),
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
                action: "create_feature_matrix",
                instructions: `Build a feature comparison matrix in ${params.framework} with ${params.plans.length} plan columns and ${params.categories.length} feature categories. Use a sticky header row with plan names. Group features by category with collapsible sections. Show checkmarks, x marks, or custom values per cell. Make horizontally scrollable on mobile with the first column (feature names) sticky. Add tooltips for feature descriptions. Include a "Compare plans" expandable section pattern.`,
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
