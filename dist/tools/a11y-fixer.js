import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerA11yFixerTools(server) {
    server.tool("a11y_scan_html", "Scan HTML content for accessibility issues against WCAG 2.1 guidelines", {
        html: z.string().describe("HTML content to scan for accessibility issues"),
        level: z.string().optional().describe("WCAG conformance level: 'A', 'AA', or 'AAA'"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_html_accessibility",
                        instructions: "Scan the provided HTML for accessibility violations against WCAG 2.1 guidelines at the specified conformance level. Check for missing alt text, improper heading hierarchy, insufficient color contrast references, missing form labels, keyboard navigation issues, missing ARIA landmarks, and incorrect semantic HTML usage. Categorize each issue by severity (critical, serious, moderate, minor) and WCAG criterion.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("a11y_add_aria", "Add appropriate ARIA attributes to HTML elements to improve accessibility", {
        html: z.string().describe("HTML content to enhance with ARIA attributes"),
        component_type: z.string().optional().describe("UI component type for context: 'modal', 'nav', 'form', 'table', 'tabs'"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "add_aria_attributes",
                        instructions: "Analyze the provided HTML and add appropriate ARIA attributes to improve accessibility. Add aria-label, aria-labelledby, aria-describedby for elements lacking accessible names. Add role attributes where semantic HTML is not used. Add aria-expanded, aria-controls, aria-hidden for interactive components. Ensure all ARIA attributes follow the WAI-ARIA specification and do not conflict with native semantics.",
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("a11y_generate_report", "Generate a comprehensive accessibility audit report with remediation guidance (Pro)", {
        html: z.string().describe("HTML content to audit"),
        scan_results: z.string().optional().describe("Previous scan results to include in the report"),
        standard: z.string().optional().describe("Accessibility standard: 'wcag21', 'wcag22', 'section508'"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            action: "upgrade_required",
                            instructions: "This tool requires a Pro subscription. Upgrade to Pro to generate comprehensive accessibility audit reports with detailed remediation guidance and compliance summaries.",
                        }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "generate_a11y_report",
                        instructions: "Generate a comprehensive accessibility audit report covering all WCAG criteria. Include an executive summary with pass/fail counts, detailed findings organized by principle (Perceivable, Operable, Understandable, Robust), specific code examples for each issue, remediation guidance with corrected code snippets, and a compliance score. Format as a structured document suitable for stakeholder review.",
                    }, null, 2),
                },
            ],
        };
    });
}
