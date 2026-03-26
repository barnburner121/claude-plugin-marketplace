import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerJavaSpringTools(server) {
    server.tool("scaffold_spring_boot", "Generate Spring Boot project structure with starter dependencies", {
        group_id: z.string().describe("Maven group ID (e.g. com.example)"),
        artifact_id: z.string().describe("Maven artifact ID"),
        java_version: z.enum(["17", "21", "22"]).optional().describe("Java version"),
        build_tool: z.enum(["maven", "gradle"]).optional().describe("Build tool"),
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
                        action: "scaffold_spring_boot",
                        instructions: `Scaffold a Spring Boot 3.x project with groupId '${params.group_id}', artifactId '${params.artifact_id}', Java ${params.java_version || "21"}, using ${params.build_tool || "gradle"}. Include src/main/java, src/main/resources, src/test directories. Generate application.yml, the main Application class, and a health check controller. Add spring-boot-starter-web, spring-boot-starter-actuator, and spring-boot-starter-test dependencies.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_spring_config", "Generate Spring Boot configuration files for different profiles", {
        profiles: z.array(z.string()).optional().describe("Spring profiles (e.g. dev, staging, prod)"),
        features: z.array(z.enum(["database", "cache", "security", "messaging", "observability"])).optional().describe("Features to configure"),
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
                        action: "generate_spring_config",
                        instructions: `Generate Spring Boot application.yml files for profiles: ${(params.profiles || ["default", "dev", "prod"]).join(", ")}. Configure features: ${(params.features || ["database", "security"]).join(", ")}. Include environment variable placeholders, sensible defaults, and comments explaining each property. Use Spring Boot 3.x configuration properties.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("generate_spring_security", "Generate Spring Security configuration with authentication flows (Pro feature)", {
        auth_type: z.enum(["jwt", "oauth2", "session", "basic"]).optional().describe("Authentication type"),
        features: z.array(z.string()).optional().describe("Security features to enable"),
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
                            instructions: "Spring Security configuration is a Pro feature. Upgrade to Pro for production-ready security configs with JWT, OAuth2, CORS, and CSRF protection.",
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
                        action: "generate_spring_security",
                        instructions: `Generate Spring Security 6.x configuration using ${params.auth_type || "jwt"} authentication. Include SecurityFilterChain bean, UserDetailsService, password encoder, CORS configuration, and CSRF settings. Generate the security config class, authentication provider, and filter classes. Add test configurations for @WebMvcTest.`,
                    }, null, 2),
                },
            ],
        };
    });
}
