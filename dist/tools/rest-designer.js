import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerRestDesignerTools(server) {
    server.tool("rest_design_endpoints", "Design RESTful API endpoints with proper resource naming, HTTP methods, and status codes", {
        resource_name: z.string().describe("The primary resource name (e.g. 'users', 'orders')"),
        nested_resources: z.array(z.string()).optional().describe("Optional nested/sub-resources"),
        actions: z.array(z.string()).optional().describe("Custom actions beyond CRUD (e.g. 'activate', 'archive')"),
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
                        action: "design_rest_endpoints",
                        instructions: `Design RESTful endpoints for the '${params.resource_name}' resource. Include standard CRUD operations (GET, POST, PUT, PATCH, DELETE) with proper URI patterns following REST conventions. ${params.nested_resources ? `Include nested routes for: ${params.nested_resources.join(", ")}.` : ""} ${params.actions ? `Add custom action endpoints for: ${params.actions.join(", ")}.` : ""} Use plural nouns, proper HTTP status codes, and consistent response envelopes.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("rest_generate_routes", "Generate Express/Fastify route handlers with validation and error handling", {
        endpoints: z.array(z.string()).describe("List of endpoints to generate routes for (e.g. 'GET /users', 'POST /users')"),
        framework: z.enum(["express", "fastify"]).default("express").describe("Target framework"),
        include_validation: z.boolean().default(true).describe("Whether to include request validation"),
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
                        action: "generate_rest_routes",
                        instructions: `Generate ${params.framework} route handlers for the following endpoints: ${params.endpoints.join(", ")}. ${params.include_validation ? "Include Zod-based request validation for body, params, and query." : ""} Add proper error handling with try/catch, return appropriate HTTP status codes, and follow controller-service separation pattern.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("rest_validate_conventions", "Pro: Validate REST API design against best practices and naming conventions", {
        openapi_spec: z.string().describe("OpenAPI/Swagger spec or list of endpoints to validate"),
        strictness: z.enum(["relaxed", "standard", "strict"]).default("standard").describe("Validation strictness level"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The rest_validate_conventions tool requires a Pro subscription. Please upgrade to access REST convention validation." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "validate_rest_conventions",
                        instructions: `Validate the provided API spec against REST best practices at '${params.strictness}' strictness. Check for: proper plural noun usage, consistent casing (kebab-case for URIs), correct HTTP method semantics, proper status codes, versioning strategy, pagination patterns, filtering conventions, and HATEOAS compliance. Flag violations and suggest corrections.`,
                    }, null, 2),
                },
            ],
        };
    });
}
