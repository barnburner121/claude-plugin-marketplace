import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerNodeNestjsTools(server) {
    server.tool("generate_nestjs_module", "Generate a NestJS module with controller, service, and DTOs", {
        module_name: z.string().describe("Module name (e.g. users, products)"),
        features: z.array(z.enum(["crud", "auth-guard", "caching", "events", "websocket"])).optional().describe("Module features"),
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
                        action: "generate_nestjs_module",
                        instructions: `Generate a NestJS module '${params.module_name}' with features: ${(params.features || ["crud"]).join(", ")}. Create ${params.module_name}.module.ts, ${params.module_name}.controller.ts, ${params.module_name}.service.ts, dto/ directory with create and update DTOs using class-validator decorators, and entities/ directory with TypeORM entity. Include Swagger decorators on all endpoints.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_nestjs_controller", "Generate a NestJS controller with decorators and route handlers", {
        controller_name: z.string().describe("Controller name"),
        routes: z.array(z.string()).optional().describe("Custom route paths"),
        use_guards: z.boolean().optional().describe("Include auth guards"),
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
                        action: "generate_nestjs_controller",
                        instructions: `Generate a NestJS controller '${params.controller_name}' with routes: ${(params.routes || ["GET /", "GET /:id", "POST /", "PATCH /:id", "DELETE /:id"]).join(", ")}. ${params.use_guards ? "Include @UseGuards(JwtAuthGuard) and @Roles() decorators." : ""} Add @ApiTags, @ApiOperation, @ApiResponse Swagger decorators, validation pipes, and ParseIntPipe/ParseUUIDPipe for params. Include unit test file with jest mocks.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_nestjs_service", "Generate a NestJS service with repository pattern and transactions (Pro feature)", {
        service_name: z.string().describe("Service name"),
        database: z.enum(["typeorm", "prisma", "mongoose", "drizzle"]).optional().describe("Database integration"),
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
                            instructions: "NestJS service generation with repository pattern is a Pro feature. Upgrade to Pro for services with transactions, error handling, caching, and event emission.",
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
                        action: "generate_nestjs_service",
                        instructions: `Generate a NestJS service '${params.service_name}' using ${params.database || "typeorm"} with repository pattern. Include CRUD operations with pagination, transaction support using QueryRunner or @Transactional, custom exceptions extending HttpException, event emission with @nestjs/event-emitter, and comprehensive unit tests with mock repositories.`,
                    }, null, 2),
                },
            ],
        };
    });
}
