import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerDisasterRecoveryTools(server: McpServer) {
  server.tool(
    "dr_assess_risks",
    "Assess disaster recovery risks for infrastructure components",
    {
      system_name: z.string().describe("Name of the system to assess"),
      components: z.array(z.string()).describe("List of infrastructure components"),
      region: z.string().optional().describe("Primary deployment region"),
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
                action: "assess_risks",
                instructions: `Assess disaster recovery risks for system '${params.system_name}' with components: ${params.components.join(", ")}${params.region ? ` deployed in '${params.region}'` : ""}. Identify single points of failure, evaluate RTO/RPO requirements, assess data loss scenarios, and classify risks by likelihood and impact. Provide a risk matrix and priority ranking.`,
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
    "dr_generate_plan",
    "Generate a comprehensive disaster recovery plan document",
    {
      system_name: z.string().describe("Name of the system"),
      rto_minutes: z.number().describe("Recovery Time Objective in minutes"),
      rpo_minutes: z.number().describe("Recovery Point Objective in minutes"),
      tier_level: z.enum(["bronze", "silver", "gold", "platinum"]).optional().describe("DR tier level"),
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
                action: "generate_plan",
                instructions: `Generate a disaster recovery plan for system '${params.system_name}' with RTO of ${params.rto_minutes} minutes and RPO of ${params.rpo_minutes} minutes at '${params.tier_level ?? "silver"}' tier. Include backup strategies, failover procedures, communication plans, escalation paths, recovery steps, and validation checklists. Define roles and responsibilities for the DR team.`,
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
    "dr_create_runbooks",
    "Create detailed DR runbooks with step-by-step recovery procedures (Pro)",
    {
      system_name: z.string().describe("Name of the system"),
      scenario: z.string().describe("Disaster scenario (e.g. region_outage, data_corruption, ransomware)"),
      automation_level: z.enum(["manual", "semi-automated", "fully-automated"]).optional().describe("Level of automation"),
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
                { action: "upgrade_required", instructions: "The dr_create_runbooks tool requires a Pro subscription. Please upgrade to access DR runbook creation features." },
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
                action: "create_runbooks",
                instructions: `Create a DR runbook for system '${params.system_name}' covering the '${params.scenario}' scenario with '${params.automation_level ?? "semi-automated"}' automation. Include pre-conditions, step-by-step procedures, validation checks at each stage, rollback procedures, post-recovery verification, and lessons-learned template. Add estimated time for each step and decision trees for common failure modes.`,
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
