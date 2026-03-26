import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerContainerGuardTools(server) {
    server.tool("container_audit_dockerfile", "Audit a Dockerfile for security best practices and optimization opportunities", {
        file_path: z.string().describe("Path to the Dockerfile"),
        api_key: z.string().optional().describe("API key for Pro/Enterprise"),
    }, async ({ file_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "audit_dockerfile",
                        file_path,
                        instructions: "Read the Dockerfile and audit for: (1) Base image - is it pinned to a specific digest or version? Is it a minimal image (alpine, distroless, slim)? (2) Layer optimization - are RUN commands combined to reduce layers? (3) Build cache - are COPY commands ordered correctly for cache efficiency? (4) Security - is there a non-root USER? Are secrets passed via build args? (5) Multi-stage build - is it used to minimize final image size? (6) .dockerignore - does one exist? Report each finding with severity and fix.",
                    }, null, 2),
                }],
        };
    });
    server.tool("container_scan_compose", "Scan docker-compose files for security and configuration issues", {
        file_path: z.string().describe("Path to docker-compose.yml"),
        api_key: z.string().optional(),
    }, async ({ file_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "scan_compose",
                        file_path,
                        instructions: "Read the docker-compose file and check for: (1) Services using 'privileged: true', (2) Hardcoded passwords or secrets in environment variables (should use secrets or .env), (3) Containers with unnecessary port mappings to host, (4) Missing health checks, (5) Volumes mounting sensitive host paths (/, /etc, /var/run/docker.sock), (6) Missing restart policies, (7) Missing network isolation between services. Report each issue with severity and recommended fix.",
                    }, null, 2),
                }],
        };
    });
    server.tool("container_optimize_image", "Suggest optimizations to reduce Docker image size and build time", {
        file_path: z.string().describe("Path to the Dockerfile"),
        api_key: z.string().optional(),
    }, async ({ file_path, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "optimize_image",
                        file_path,
                        instructions: "Read the Dockerfile and suggest optimizations: (1) Switch to smaller base images (alpine, slim, distroless), (2) Combine RUN commands with && to reduce layers, (3) Add --no-cache flags to package manager installs, (4) Remove unnecessary tools and caches in the same layer they were created, (5) Use multi-stage builds to separate build and runtime, (6) Order COPY statements to maximize build cache hits (dependencies before source code), (7) Use .dockerignore to exclude node_modules, .git, etc. Provide the optimized Dockerfile.",
                    }, null, 2),
                }],
        };
    });
    server.tool("container_security_report", "Generate a comprehensive container security report (Pro feature)", {
        directory: z.string().describe("Project directory with Docker files"),
        api_key: z.string().optional(),
    }, async ({ directory, api_key }) => {
        const { allowed, tier } = checkRateLimit(api_key);
        if (!allowed)
            return rateLimitError(tier);
        if (tier === "free") {
            return {
                content: [{
                        type: "text",
                        text: "Container security reports are a Pro feature. Upgrade at https://mcpize.com/barnburner121/plugin-hub",
                    }],
            };
        }
        return {
            content: [{
                    type: "text",
                    text: JSON.stringify({
                        action: "container_security_report",
                        directory,
                        instructions: "Find all Dockerfiles and docker-compose files in the directory. Run a full audit on each. Generate a comprehensive report with: (1) Executive summary with overall security score, (2) Critical findings that need immediate attention, (3) Image optimization opportunities with estimated size reduction, (4) Network security assessment, (5) Secrets management review, (6) Prioritized remediation plan. Format as a structured markdown report.",
                    }, null, 2),
                }],
        };
    });
}
