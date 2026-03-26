import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerPythonFastapiTools(server) {
    server.tool("scaffold_fastapi_project", "Generate a FastAPI project with best-practice structure", {
        project_name: z.string().describe("Project name"),
        database: z.enum(["postgresql", "mysql", "sqlite", "mongodb"]).optional().describe("Database to configure"),
        async_db: z.boolean().optional().describe("Use async database driver"),
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
                        action: "scaffold_fastapi_project",
                        instructions: `Scaffold a FastAPI project '${params.project_name}' with app/, app/api/, app/core/, app/models/, app/schemas/, app/services/, and app/db/ directories. Configure ${params.database || "postgresql"} with ${params.async_db !== false ? "async" : "sync"} driver. Generate main.py with lifespan handler, config.py with pydantic-settings, and alembic migration setup.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_fastapi_router", "Generate a FastAPI router with CRUD endpoints and dependency injection", {
        resource_name: z.string().describe("Resource name (e.g. users, products)"),
        fields: z.array(z.string()).optional().describe("Resource fields as name:type pairs"),
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
                        action: "generate_fastapi_router",
                        instructions: `Generate a FastAPI router for resource '${params.resource_name}' with full CRUD endpoints (GET list, GET by id, POST, PUT, PATCH, DELETE). Fields: ${(params.fields || ["id:int", "name:str", "created_at:datetime"]).join(", ")}. Include Pydantic request/response schemas, SQLAlchemy model, service layer with repository pattern, and dependency injection for database sessions.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_fastapi_models", "Generate Pydantic models and SQLAlchemy ORM models with relationships (Pro feature)", {
        entities: z.array(z.string()).describe("Entity names to model"),
        relationships: z.array(z.string()).optional().describe("Relationships as 'EntityA->EntityB:type' format"),
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
                            instructions: "FastAPI model generation with relationships is a Pro feature. Upgrade to Pro for auto-generated SQLAlchemy models, Pydantic schemas, and Alembic migrations with relationship mapping.",
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
                        action: "generate_fastapi_models",
                        instructions: `Generate SQLAlchemy 2.0 ORM models and Pydantic v2 schemas for entities: ${params.entities.join(", ")}. Relationships: ${(params.relationships || []).join(", ") || "none specified"}. Include Base model with common fields (id, created_at, updated_at), Mapped type annotations, relationship lazy loading config, and corresponding Create/Update/Read Pydantic schemas with model_config.`,
                    }, null, 2),
                },
            ],
        };
    });
}
