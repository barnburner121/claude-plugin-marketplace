import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerMultiTenantTools(server: McpServer) {
  server.tool(
    "tenant_design_schema",
    "Design multi-tenant database schema with isolation strategy selection",
    {
      strategy: z.enum(["shared-db-shared-schema", "shared-db-separate-schema", "separate-db"]).default("shared-db-shared-schema").describe("Tenant isolation strategy"),
      tables: z.array(z.string()).describe("Core tables that need tenant isolation"),
      database: z.enum(["postgresql", "mysql", "mongodb"]).default("postgresql").describe("Database type"),
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
                action: "design_tenant_schema",
                instructions: `Design a multi-tenant ${params.database} schema using the ${params.strategy} strategy for tables: ${params.tables.join(", ")}. ${params.strategy === "shared-db-shared-schema" ? "Add tenant_id column to all tenant-scoped tables with composite indexes. Implement Row-Level Security (RLS) policies for automatic filtering." : params.strategy === "shared-db-separate-schema" ? "Create per-tenant schemas with a tenant registry table. Generate schema provisioning and migration scripts." : "Design per-tenant database provisioning with a central routing database."} Include tenant registration, onboarding data seeding, and cross-tenant query prevention.`,
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
    "tenant_generate_middleware",
    "Generate tenant resolution middleware with context propagation",
    {
      resolution: z.enum(["subdomain", "header", "jwt-claim", "path-param", "query-param"]).default("subdomain").describe("How to identify the tenant from requests"),
      framework: z.enum(["express", "fastify", "nestjs"]).default("express").describe("Server framework"),
      include_caching: z.boolean().default(true).describe("Whether to cache tenant lookups"),
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
                action: "generate_tenant_middleware",
                instructions: `Generate ${params.framework} middleware that resolves the current tenant from ${params.resolution}. ${params.include_caching ? "Cache tenant lookups in memory with TTL for performance." : ""} Propagate tenant context through the request lifecycle using AsyncLocalStorage, inject tenant ID into database queries automatically, validate tenant exists and is active, handle unknown tenants with proper error responses, and add tenant info to structured logging context.`,
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
    "tenant_isolation_setup",
    "Pro: Set up complete tenant data isolation with RLS, connection pooling, and resource limits",
    {
      isolation_level: z.enum(["row-level", "schema-level", "database-level"]).default("row-level").describe("Data isolation level"),
      include_rate_limits: z.boolean().default(true).describe("Whether to add per-tenant rate limiting"),
      include_resource_quotas: z.boolean().default(true).describe("Whether to add per-tenant resource quotas"),
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
                { action: "upgrade_required", instructions: "The tenant_isolation_setup tool requires a Pro subscription. Please upgrade to access tenant isolation setup." },
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
                action: "setup_tenant_isolation",
                instructions: `Set up ${params.isolation_level} tenant data isolation. ${params.isolation_level === "row-level" ? "Implement PostgreSQL RLS policies on all tenant tables, set session variables for tenant context, and add migration helpers for new tables." : params.isolation_level === "schema-level" ? "Create dynamic schema routing, per-schema connection pooling, and automated schema provisioning." : "Set up database-per-tenant with connection routing, provisioning automation, and centralized migration management."} ${params.include_rate_limits ? "Add per-tenant API rate limiting with configurable tiers." : ""} ${params.include_resource_quotas ? "Add per-tenant storage, row count, and API call quotas with usage tracking." : ""} Include tenant isolation testing utilities to verify no data leakage.`,
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
