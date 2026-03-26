import { z } from "zod";
import { checkRateLimit, rateLimitError } from "../auth.js";
export function registerNginxConfigTools(server) {
    server.tool("nginx_generate_proxy", "Generate an Nginx reverse proxy configuration", {
        server_name: z.string().describe("Server hostname"),
        upstream_url: z.string().describe("Backend upstream URL"),
        listen_port: z.number().optional().describe("Listen port (default 80)"),
        websocket: z.boolean().optional().describe("Enable WebSocket proxying"),
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
                        action: "generate_proxy",
                        instructions: `Generate an Nginx reverse proxy configuration for server '${params.server_name}' listening on port ${params.listen_port ?? 80} proxying to '${params.upstream_url}'. ${params.websocket ? "Include WebSocket upgrade headers." : ""} Add proxy headers, timeouts, buffering settings, and connection keep-alive configuration.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("nginx_generate_ssl", "Generate Nginx SSL/TLS configuration with modern cipher suites", {
        server_name: z.string().describe("Server hostname"),
        cert_path: z.string().describe("Path to SSL certificate"),
        key_path: z.string().describe("Path to SSL private key"),
        hsts: z.boolean().optional().describe("Enable HSTS (default true)"),
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
                        action: "generate_ssl",
                        instructions: `Generate Nginx SSL/TLS configuration for '${params.server_name}' with certificate at '${params.cert_path}' and key at '${params.key_path}'. Use TLS 1.2+ with modern cipher suites, OCSP stapling, session caching, and ${params.hsts !== false ? "HSTS with preload" : "no HSTS"}. Include HTTP to HTTPS redirect block.`,
                    }, null, 2),
                },
            ],
        };
    });
    server.tool("nginx_optimize", "Optimize an Nginx configuration for performance and security (Pro)", {
        config_content: z.string().describe("Current Nginx configuration content"),
        optimization_target: z.enum(["performance", "security", "both"]).optional().describe("Optimization focus"),
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
                        text: JSON.stringify({ action: "upgrade_required", instructions: "The nginx_optimize tool requires a Pro subscription. Please upgrade to access Nginx optimization features." }, null, 2),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        action: "optimize_nginx",
                        instructions: `Optimize the Nginx configuration targeting '${params.optimization_target ?? "both"}'. Apply worker process tuning, gzip/brotli compression, static asset caching, rate limiting, request body size limits, security headers (CSP, X-Frame-Options, X-Content-Type-Options), and connection pooling optimizations.`,
                    }, null, 2),
                },
            ],
        };
    });
}
