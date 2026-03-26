import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerSeoAuditorTools(server: McpServer) {
  server.tool(
    "seo_audit_meta",
    "Audit HTML meta tags, Open Graph, and structured data for SEO completeness",
    {
      html: z.string().describe("HTML content to audit for SEO meta tags"),
      url: z.string().optional().describe("Page URL for canonical and sitemap checks"),
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
                action: "audit_seo_meta",
                instructions:
                  "Analyze the provided HTML for SEO meta tag completeness. Check for title tag (length 50-60 chars), meta description (length 150-160 chars), canonical URL, Open Graph tags (og:title, og:description, og:image, og:type), Twitter Card tags, robots meta, viewport meta, charset declaration, structured data (JSON-LD), and hreflang tags for multi-language sites. Report missing, incomplete, or improperly formatted tags with specific recommendations.",
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
    "seo_audit_performance",
    "Audit HTML structure and content for SEO performance factors",
    {
      html: z.string().describe("HTML content to audit for SEO performance"),
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
                action: "audit_seo_performance",
                instructions:
                  "Analyze the HTML for SEO performance factors: heading hierarchy (single H1, proper nesting), image alt attributes and lazy loading, internal/external link quality, content length and keyword density, semantic HTML usage, mobile-friendliness indicators, render-blocking resources, and Core Web Vitals hints (large images, layout shift triggers, long tasks). Score each factor and provide an overall SEO health rating.",
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
    "seo_generate_fixes",
    "Generate specific code fixes to resolve identified SEO issues (Pro)",
    {
      html: z.string().describe("HTML content with SEO issues to fix"),
      audit_results: z.string().describe("SEO audit results identifying issues to fix"),
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
                    "This tool requires a Pro subscription. Upgrade to Pro to automatically generate corrected HTML with all SEO issues fixed, including meta tags, structured data, and performance optimizations.",
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
                action: "generate_seo_fixes",
                instructions:
                  "Generate the corrected HTML with all identified SEO issues resolved. Add missing meta tags with optimized content, fix heading hierarchy, add alt text to images, insert structured data (JSON-LD) for the page type, add lazy loading attributes, fix semantic HTML issues, and optimize for Core Web Vitals. Provide the complete fixed HTML along with a diff summary of all changes made.",
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
