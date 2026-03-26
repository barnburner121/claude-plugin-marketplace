import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";

export function registerPythonDjangoTools(server: McpServer) {
  server.tool(
    "scaffold_django_project",
    "Generate a Django project with production-ready settings structure",
    {
      project_name: z.string().describe("Django project name"),
      django_version: z.string().optional().describe("Django version (e.g. 5.1)"),
      api_only: z.boolean().optional().describe("Configure as API-only with Django REST Framework"),
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
                action: "scaffold_django_project",
                instructions: `Scaffold a Django ${params.django_version || "5.1"} project '${params.project_name}'. Use split settings (base.py, development.py, production.py, test.py). ${params.api_only ? "Configure Django REST Framework with serializers, viewsets, and router setup." : "Include templates/, static/, and media/ directories."} Generate manage.py, wsgi.py, asgi.py, urls.py, and a docker-compose.yml with PostgreSQL.`,
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
    "generate_django_app",
    "Generate a Django app with models, views, and URL configuration",
    {
      app_name: z.string().describe("Django app name"),
      model_names: z.array(z.string()).optional().describe("Model names to generate"),
      use_cbv: z.boolean().optional().describe("Use class-based views instead of function-based"),
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
                action: "generate_django_app",
                instructions: `Generate a Django app '${params.app_name}' with models: ${(params.model_names || ["Item"]).join(", ")}. Use ${params.use_cbv !== false ? "class-based views (ListView, DetailView, CreateView, UpdateView, DeleteView)" : "function-based views"}. Generate models.py, views.py, urls.py, admin.py with ModelAdmin, forms.py, serializers.py, tests.py with TestCase classes, and an initial migration.`,
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
    "generate_django_settings",
    "Generate advanced Django settings with caching, celery, and security (Pro feature)",
    {
      features: z.array(z.enum(["celery", "redis-cache", "s3-storage", "sentry", "cors", "channels"])).optional().describe("Features to configure"),
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
                  instructions: "Advanced Django settings generation is a Pro feature. Upgrade to Pro for production settings with Celery, Redis, S3, Sentry, and security hardening.",
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
                action: "generate_django_settings",
                instructions: `Generate production Django settings for features: ${(params.features || ["celery", "redis-cache", "sentry"]).join(", ")}. Include environment variable loading with django-environ, security middleware settings (HSTS, CSP, secure cookies), database connection pooling, logging configuration with structured output, and deployment checklist verification.`,
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
