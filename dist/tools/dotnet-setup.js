import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerDotnetSetupTools(server) {
    server.tool("scaffold_dotnet_project", "Generate a .NET project with folder structure and configuration", {
        project_name: z.string().describe("Project name"),
        template: z.enum(["webapi", "mvc", "blazor", "console", "classlib", "worker"]).optional().describe("Project template"),
        dotnet_version: z.enum(["8", "9"]).optional().describe(".NET version"),
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
                        action: "scaffold_dotnet_project",
                        instructions: `Scaffold a .NET ${params.dotnet_version || "8"} ${params.template || "webapi"} project named '${params.project_name}'. Generate the .csproj file, Program.cs with minimal API setup, appsettings.json and appsettings.Development.json, a Dockerfile, and .editorconfig. Include directory structure with Controllers/, Models/, Services/, and Data/ folders.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_dotnet_solution", "Generate a .NET solution file with multiple projects", {
        solution_name: z.string().describe("Solution name"),
        projects: z.array(z.string()).describe("Project names to include"),
        include_tests: z.boolean().optional().describe("Include test projects"),
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
                        action: "generate_dotnet_solution",
                        instructions: `Generate a .NET solution '${params.solution_name}.sln' containing projects: ${params.projects.join(", ")}. ${params.include_tests !== false ? "Include corresponding .Tests projects using xUnit." : ""} Set up project references between layers (API -> Application -> Domain -> Infrastructure). Generate Directory.Build.props with shared settings and a global.json pinning the SDK version.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_dotnet_config", "Generate advanced .NET configuration with DI and middleware (Pro feature)", {
        features: z.array(z.enum(["ef-core", "identity", "signalr", "grpc", "health-checks", "serilog"])).optional().describe("Features to configure"),
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
                            instructions: "Advanced .NET configuration is a Pro feature. Upgrade to Pro for EF Core, Identity, SignalR, and other advanced configurations with dependency injection patterns.",
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
                        action: "generate_dotnet_config",
                        instructions: `Generate .NET configuration for features: ${(params.features || ["ef-core", "health-checks", "serilog"]).join(", ")}. Include extension methods for IServiceCollection registration, middleware pipeline setup in Program.cs, configuration classes with IOptions pattern, and integration test setup. Follow clean architecture patterns.`,
                    }, null, 2),
                },
            ],
        };
    });
}
