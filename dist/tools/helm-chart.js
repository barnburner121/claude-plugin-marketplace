import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerHelmChartTools(server) {
    server.tool("helm_generate_chart", "Generate a Helm chart scaffold with templates and default values", {
        chart_name: z.string().describe("Name of the Helm chart"),
        app_version: z.string().optional().describe("Application version"),
        chart_version: z.string().optional().describe("Chart version (default 0.1.0)"),
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
                        action: "generate_chart",
                        instructions: `Generate a Helm chart scaffold named '${params.chart_name}' with chart version '${params.chart_version ?? "0.1.0"}' and app version '${params.app_version ?? "1.0.0"}'. Include Chart.yaml, values.yaml, deployment.yaml, service.yaml, ingress.yaml, hpa.yaml, serviceaccount.yaml, and NOTES.txt templates with helpers.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("helm_add_values", "Add or merge values into a Helm chart values.yaml", {
        chart_name: z.string().describe("Name of the Helm chart"),
        values: z.string().describe("YAML string of values to add or merge"),
        environment: z.string().optional().describe("Target environment (e.g. staging, production)"),
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
                        action: "add_values",
                        instructions: `Merge the provided values into the Helm chart '${params.chart_name}' values file${params.environment ? ` for the '${params.environment}' environment` : ""}. Validate value types, ensure no conflicts with existing defaults, and add comments describing each value group.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("helm_lint", "Lint and validate a Helm chart for errors and best practices (Pro)", {
        chart_name: z.string().describe("Name of the Helm chart to lint"),
        strict: z.boolean().optional().describe("Enable strict linting mode"),
        api_key: z.string().optional().describe("API key for authentication"),
    }, async (params) => {
        const { allowed, tier } = checkRateLimit(params.api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier !== "pro") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The helm_lint tool requires a Pro subscription. Please upgrade to access Helm linting and validation features." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "lint_chart",
                        instructions: `Lint the Helm chart '${params.chart_name}' ${params.strict ? "in strict mode " : ""}for template errors, missing values, deprecated API versions, label conventions, and resource naming compliance. Return a list of warnings and errors with suggested fixes.`,
                    }, null, 2),
                },
            ],
        };
    });
}
