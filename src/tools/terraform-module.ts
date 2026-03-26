import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerTerraformModuleTools(server: McpServer) {
  server.tool(
    "tf_generate_module",
    "Generate a Terraform module with main, outputs, and provider configuration",
    {
      module_name: z.string().describe("Name of the Terraform module"),
      provider: z.string().describe("Cloud provider (aws, gcp, azure)"),
      resource_type: z.string().describe("Primary resource type to manage"),
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
                action: "generate_module",
                instructions: `Generate a Terraform module '${params.module_name}' for provider '${params.provider}' managing '${params.resource_type}' resources. Include main.tf, variables.tf, outputs.tf, versions.tf, and a README. Use required_providers block, add tagging support, and follow HashiCorp module structure conventions.`,
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
    "tf_generate_variables",
    "Generate Terraform variable definitions with validation and descriptions",
    {
      module_name: z.string().describe("Name of the module"),
      variables: z.array(z.string()).describe("List of variable names to generate"),
      include_defaults: z.boolean().optional().describe("Include default values"),
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
                action: "generate_variables",
                instructions: `Generate Terraform variable definitions for module '${params.module_name}' with variables: ${params.variables.join(", ")}. ${params.include_defaults ? "Include sensible default values." : "Mark required variables without defaults."} Add type constraints, descriptions, and validation blocks where appropriate.`,
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
    "tf_best_practices",
    "Analyze Terraform code for best practices and compliance (Pro)",
    {
      tf_content: z.string().describe("Terraform code content to analyze"),
      compliance_framework: z.string().optional().describe("Compliance framework (e.g. CIS, SOC2)"),
      api_key: z.string().optional().describe("API key for authentication"),
    },
    async (params) => {
      const { allowed, tier } = checkRateLimit(params.api_key);
      if (!allowed) return rateLimitError(tier);
      if (tier !== "pro") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                { action: "upgrade_required", instructions: "The tf_best_practices tool requires a Pro subscription. Please upgrade to access Terraform best practices analysis." },
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
                action: "best_practices_audit",
                instructions: `Analyze the Terraform code for best practices${params.compliance_framework ? ` and ${params.compliance_framework} compliance` : ""}. Check for state management, remote backend usage, module versioning, resource naming conventions, sensitive variable handling, lifecycle rules, and drift detection configuration. Return findings with severity and remediation guidance.`,
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
