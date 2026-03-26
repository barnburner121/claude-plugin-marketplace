import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerEtlBuilderTools(server: McpServer) {
  server.tool(
    "etl_design_pipeline",
    "Design an ETL/ELT pipeline with source, transform, and load stages",
    {
      source_type: z.enum(["database", "api", "csv", "s3", "kafka", "webhook"]).describe("Data source type"),
      destination: z.enum(["database", "data-warehouse", "s3", "elasticsearch"]).describe("Data destination"),
      volume: z.enum(["small", "medium", "large", "streaming"]).default("medium").describe("Expected data volume"),
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
                action: "design_etl_pipeline",
                instructions: `Design an ETL pipeline from ${params.source_type} to ${params.destination} for ${params.volume} data volume. Define extraction strategy (full vs incremental, CDC), transformation steps with data validation and cleansing, and loading pattern (upsert, append, replace). Include error handling with dead letter queues, data quality checks, lineage tracking, and monitoring dashboards. Recommend batch size and parallelism settings.`,
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
    "etl_generate_transforms",
    "Generate data transformation functions with validation, mapping, and enrichment",
    {
      source_fields: z.array(z.string()).describe("Source field names and types (e.g. 'first_name:string', 'created_at:timestamp')"),
      target_fields: z.array(z.string()).describe("Target field names and types"),
      transformations: z.array(z.string()).optional().describe("Specific transformations (e.g. 'concat first_name+last_name', 'parse date')"),
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
                action: "generate_etl_transforms",
                instructions: `Generate TypeScript transformation functions mapping source fields (${params.source_fields.join(", ")}) to target fields (${params.target_fields.join(", ")}). ${params.transformations ? `Apply transformations: ${params.transformations.join(", ")}.` : ""} Include input validation with Zod schemas, null/undefined handling, type coercion, date parsing and timezone normalization, string sanitization, and error collection per record. Use a functional pipeline pattern for composability.`,
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
    "etl_schedule_setup",
    "Pro: Set up ETL pipeline scheduling with cron jobs, dependency management, and monitoring",
    {
      scheduler: z.enum(["node-cron", "bullmq", "agenda", "custom"]).default("bullmq").describe("Scheduling library"),
      pipelines: z.array(z.string()).describe("Pipeline names to schedule"),
      frequency: z.string().default("0 */6 * * *").describe("Cron expression for scheduling"),
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
                { action: "upgrade_required", instructions: "The etl_schedule_setup tool requires a Pro subscription. Please upgrade to access ETL scheduling setup." },
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
                action: "setup_etl_schedule",
                instructions: `Set up scheduling for ETL pipelines: ${params.pipelines.join(", ")} using ${params.scheduler} with cron expression '${params.frequency}'. Implement pipeline dependency graphs (DAG), concurrent execution limits, failure retry with backoff, run history tracking, and alerting on failures. Add manual trigger capability, pipeline pause/resume, and a status dashboard endpoint. Include overlap prevention to avoid concurrent runs of the same pipeline.`,
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
